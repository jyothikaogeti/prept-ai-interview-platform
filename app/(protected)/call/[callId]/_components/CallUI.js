"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquare, Sparkles } from "lucide-react";

import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamTheme,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import {
  Channel,
  Chat,
  MessageList,
  useCreateChatClient,
  Window,
  MessageComposer,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

import { Badge } from "@/components/ui/badge";
import AIQuestionsPanel from "./AIQuestionsPanel";

export function CallUI({
  apiKey,
  callId,
  token,
  currentUser,
  booking,
  isInterviewer,
  onLeave,
}) {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();

  const [activeTab, setActiveTab] = useState("chat");
  const [chatChannel, setChatChannel] = useState(null);

  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: {
      id: currentUser.id,
      name: currentUser.name,
      image: currentUser.imageUrl,
    },
  });

  useEffect(() => {
    if (!chatClient) return;

    const channel = chatClient.channel("messaging", callId, {
      name: "Interview Chat",
      members: [
        booking.interviewer.clerkUserId,
        booking.interviewee.clerkUserId,
      ],
    });

    channel
      .watch()
      .then(() => setChatChannel(channel))
      .catch(console.error);

    return () => {
      channel.stopWatching().catch(() => {});
    };
  }, [chatClient, callId, booking]);

  const handleLeave = useCallback(async () => {
    try {
      if (call) {
        const isRecording = call.state?.recording;
        if (isRecording) {
          await call.stopRecording().catch(() => {});
        }
        await call.leave().catch(() => {});
      }
    } finally {
      onLeave();
    }
  }, [call, onLeave]);

  if (callingState === CallingState.LEFT) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col justify-center items-center gap-3">
        <p className="text-stone-400 text-sm">Leaving call...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] bg-[#0a0a0b] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center border-b border-white/8 shrink-0 px-6 py-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-stone-500 text-xs border-white/10"
          >
            {booking.interviewer.name}
            <span className="text-stone-700 mx-1.5">×</span>
            {booking.interviewee.name}
          </Badge>

          {isInterviewer && (
            <Badge
              variant="outline"
              className="bg-amber-400/5 text-amber-400 text-xs border-amber-400/20"
            >
              Interviewer
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col flex-1 min-w-0">
          <StreamTheme>
            <SpeakerLayout participantsBarPosition="bottom" />
            <CallControls onLeave={handleLeave} />
          </StreamTheme>
        </div>

        <div className="w-85 bg-[#0a0a0b] border-l border-white/8 flex flex-col shrink-0">
          <div className="flex border-b border-white/8 shrink-0">
            <button
              type="button"
              className={`text-xs font-medium flex flex-1 justify-center items-center gap-2 transition-colors py-3 ${
                activeTab === "chat"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-stone-500 hover:text-stone-300"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              <MessageSquare size={13} />
              Chat
            </button>

            {isInterviewer && (
              <button
                type="button"
                className={`text-xs font-medium flex flex-1 justify-center items-center gap-2 transition-colors py-3 ${
                  activeTab === "ai"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
                onClick={() => setActiveTab("ai")}
              >
                <Sparkles size={13} />
                AI Questions
              </button>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === "chat" ? (
              chatClient && chatChannel ? (
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={chatChannel}>
                    <Window>
                      <MessageList />
                      <MessageComposer focus />
                    </Window>
                  </Channel>
                </Chat>
              ) : (
                <div className="h-full flex justify-center items-center">
                  <Loader2 size={18} className="text-stone-600 animate-spin" />
                </div>
              )
            ) : (
              <div className="max-h-screen h-full overflow-y-scroll p-4">
                <AIQuestionsPanel categories={booking.categories} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
