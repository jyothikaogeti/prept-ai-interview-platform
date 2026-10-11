"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

import { CallUI } from "./CallUI";

export function CallRoom({
  callId,
  token,
  apiKey,
  currentUser,
  booking,
  isInterviewer,
}) {
  const router = useRouter();

  const [call, setCall] = useState(null);
  const [videoClient, setVideoClient] = useState(null);

  const clientRef = useRef(null);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.imageUrl,
      },
      token,
    });

    const callInstance = client.call("default", callId);

    callInstance
      .join({
        create: false,
      })
      .then(() => {
        clientRef.current = client;
        setCall(callInstance);
        setVideoClient(client);
      })
      .catch(console.error);

    return () => {
      callInstance.leave().catch(() => {});
      client.disconnectUser().catch(() => {});
      clientRef.current = null;
      joinedRef.current = false;
    };
  }, [
    apiKey,
    callId,
    token,
    currentUser.id,
    currentUser.name,
    currentUser.imageUrl,
  ]);

  const handleLeave = useCallback(() => {
    router.push(isInterviewer ? "/dashboard" : "/appointments");
  }, [isInterviewer, router]);

  if (!videoClient || !call) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col justify-center items-center gap-3">
        <Loader2 size={28} className="text-amber-400 animate-spin" />
        <p className="text-stone-500 text-sm font-light">
          Connecting to call...
        </p>
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <CallUI
          apiKey={apiKey}
          callId={callId}
          token={token}
          currentUser={currentUser}
          booking={booking}
          isInterviewer={isInterviewer}
          onLeave={handleLeave}
        />
      </StreamCall>
    </StreamVideo>
  );
}
