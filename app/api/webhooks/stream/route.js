import { GoogleGenAI } from "@google/genai";
import { gunzipSync } from "node:zlib";
import { createHmac, timingSafeEqual } from "node:crypto";

import { GEMINI_MODEL } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function getUncompressedBody(rawBody) {
  if (rawBody.length >= 2 && rawBody[0] === 0x1f && rawBody[1] === 0x8b) {
    return gunzipSync(rawBody);
  }

  return rawBody;
}

function verifyStreamSignature(body, signature, secret) {
  const expectedSignature = createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf-8");
  const actual = Buffer.from(signature, "utf-8");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function POST(request) {
  const webhookSecret = process.env.STREAM_SECRET_KEY;

  if (!webhookSecret) {
    console.error("[stream-webhook] STREAM_SECRET_KEY is not configured");

    return Response.json(
      { error: "Webhook is not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("x-signature");

  if (!signature) {
    return Response.json(
      { error: "Missing webhook signature" },
      { status: 401 },
    );
  }

  let payloadBuffer;

  try {
    const rawBody = Buffer.from(await request.arrayBuffer());
    payloadBuffer = getUncompressedBody(rawBody);

    if (!verifyStreamSignature(payloadBuffer, signature, webhookSecret)) {
      return Response.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("[stream-webhook] Failed to read or verify request");

    return Response.json({ error: "Invalid webhook request" }, { status: 400 });
  }

  let body;

  try {
    body = JSON.parse(payloadBuffer.toString("utf8"));
  } catch (error) {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType = body.type;

  console.log(`[stream-webhook] Received event: ${eventType}`);

  if (
    eventType !== "call.recording_ready" &&
    eventType !== "call.transcription_ready"
  ) {
    console.log(`[stream-webhook] Ignoring event type: ${eventType}`);
    return Response.json({
      ok: true,
    });
  }

  const callCid = body.call_cid ?? "";
  const streamCallId = callCid.includes(":") ? callCid.split(":")[1] : callCid;

  console.log(
    `[stream-webhook] call_cid: ${callCid} -> streamCallId: ${streamCallId}`,
  );

  if (!streamCallId) {
    console.log(`[stream-webhook] No streamCallId found, skipping`);
    return Response.json({
      ok: true,
    });
  }

  try {
    console.log(`[stream-webhook] Looking up booking in DB...`);

    const booking = await prisma.booking.findUnique({
      where: {
        streamCallId,
      },
      include: {
        interviewer: {
          select: {
            id: true,
            clerkUserId: true,
            name: true,
            categories: true,
          },
        },
        interviewee: {
          select: {
            id: true,
            clerkUserId: true,
            name: true,
          },
        },
        feedback: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!booking) {
      console.log(
        `[stream-webhook] No booking found for streamCallId: ${streamCallId}`,
      );
      return Response.json({
        ok: true,
      });
    }

    console.log(
      `[stream-webhook] Booking found: ${booking.id} | interviewer: ${booking.interviewer.name} | interviewee: ${booking.interviewee.name}`,
    );

    if (eventType === "call.recording_ready") {
      const recordingUrl = body.call_recording?.url;

      if (!recordingUrl) {
        console.log(
          `[stream-webhook] call.recording_ready received but no URL in payload`,
        );
        return Response.json({
          ok: true,
        });
      }

      console.log(`[stream-webhook] Saving recording URL to booking...`);

      await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          recordingUrl,
        },
      });

      console.log(
        `[stream-webhook] Recording URL saved for booking ${booking.id}`,
      );

      return Response.json({
        ok: true,
      });
    }

    if (eventType === "call.transcription_ready") {
      if (booking.feedback) {
        console.log(
          `[stream-webhook] Feedback already exists for booking ${booking.id}, skipping duplicate webhook`,
        );
        return Response.json({
          ok: true,
        });
      }

      const transcriptionUrl = body.call_transcription?.url;

      if (!transcriptionUrl) {
        console.log(
          `[stream-webhook] call.transcription_ready received but no transcription URL in payload`,
        );
        return Response.json({
          ok: true,
        });
      }

      console.log(`[stream-webhook] Downloading transcript from Stream CDN...`);

      const transcriptResponse = await fetch(transcriptionUrl);

      if (!transcriptResponse.ok) {
        throw new Error(
          `Transcript download failed with status ${transcriptResponse.status}`,
        );
      }

      const transcriptText = await transcriptResponse.text();

      console.log(
        `[stream-webhook] Transcript downloaded ${transcriptText.length} chars`,
      );

      console.log(`[stream-webhook] Parsing JSON transcript...`);
      const lines = transcriptText
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch (error) {
            return null;
          }
        })
        .filter((entry) => entry?.type === "speech");

      console.log(`[stream-webhook] Parsed ${lines.length} speech segments`);

      if (lines.length === 0) {
        console.log(
          `[stream-webhook] No speech segments found in transcript, skipping`,
        );
        return Response.json({
          ok: true,
        });
      }

      const speakerMap = {
        [booking.interviewer.clerkUserId]:
          booking.interviewer.name ?? "Interviewer",
        [booking.interviewee.clerkUserId]:
          booking.interviewee.name ?? "Interviewee",
      };

      const transcript = lines
        .map(
          (line) =>
            `${speakerMap[line.speaker_id] ?? line.speaker_id}: ${line.text}`,
        )
        .join("\n");

      console.log(
        `[stream-webhook] Transcript preview: ${transcript.slice(0, 300)} ${transcript.length > 300 ? "..." : ""}`,
      );

      console.log(
        `[stream-webhook] Sending transcript to Gemini (${GEMINI_MODEL})...`,
      );

      const genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const categories =
        booking.interviewer.categories?.join(", ") ?? "General";

      const prompt = `You are an expert technical interviewer evaluating a mock interview.

      Interview categories: ${categories}
      Interviewer: ${booking.interviewer.name}
      Candidate: ${booking.interviewee.name}

      TRANSCRIPT:
      ${transcript}

      Analyze the candidate's performance. Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
      {
        "summary": "2-3 sentence overall summary of the session",
        "technical": "Assessment of technical knowledge and accuracy",
        "communication": "Assessment of clarity, structure, and communication style",
        "problemSolving": "Assessment of problem-solving approach and thought process",
        "recommendation": "HIRE / CONSIDER / NO_HIRE with a one-sentence reason",
        "strengths": ["strength 1", "strength 2", "strength 3"],
        "improvements": ["improvement 1", "improvement 2", "improvement 3"],
        "overallRating": "POOR or AVERAGE or GOOD or EXCELLENT"
      }`;

      const response = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const raw = (response.text ?? "")
        .trim()
        .replace(/^```json\s*|^```\s*|```$/gm, "")
        .trim();

      if (!raw) {
        throw new Error("Gemini returned an empty interview feedback response");
      }

      console.log(
        `[stream-webhook] Gemini Response: \n${raw.slice(0, 500)} ${raw.length > 500 ? "..." : ""}`,
      );

      const feedbackData = JSON.parse(raw);
      console.log(
        `[stream-webhook] Feedback parsed - OverallRating: ${feedbackData.overallRating} | recommendation: ${feedbackData.recommendation}`,
      );

      console.log(`[stream-webhook] Writing feedback to DB...`);

      await prisma.$transaction(async (tx) => {
        await tx.feedback.upsert({
          where: {
            bookingId: booking.id,
          },
          create: {
            bookingId: booking.id,
            summary: feedbackData.summary,
            technical: feedbackData.technical,
            communication: feedbackData.communication,
            problemSolving: feedbackData.problemSolving,
            recommendation: feedbackData.recommendation,
            strengths: feedbackData.strengths,
            improvements: feedbackData.improvements,
            overallRating: feedbackData.overallRating,
          },
          update: {},
        });

        await tx.booking.update({
          where: {
            id: booking.id,
          },
          data: {
            status: "COMPLETED",
          },
        });

        const earnExists = await tx.creditTransaction.findFirst({
          where: {
            bookingId: booking.id,
            type: "BOOKING_EARNING",
          },
        });

        if (!earnExists) {
          await tx.creditTransaction.create({
            data: {
              userId: booking.interviewer.id,
              bookingId: booking.id,
              amount: booking.creditsCharged,
              type: "BOOKING_EARNING",
            },
          });
        }
      });

      console.log(
        `[stream-webhook] Feedback upserted + booking marked COMPLETED`,
      );

      console.log(`[stream-webhook] All done for booking ${booking.id}`);
    }

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(`[stream-webhook] ${eventType} error:`, error);
    return Response.json({
      ok: true,
    });
  }
}
