import React, { FunctionComponent, useRef, useEffect, useState, useCallback } from "react";
import DailyIframe from "@daily-co/daily-js";
import { VideoContainer, Callframe, PageStyle } from "./styled";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { CurrentUserType } from "../App";

interface OptionsProps {
  iframeStyle: {
    [propName:string]: string 
  }
  showLeaveButton: boolean
  showFullscreenButton: boolean
  url?: string
}

const CALL_OPTIONS: OptionsProps = {
  iframeStyle: {
    width: "100%",
    height: "100%",
    border: "1px solid #e6eaef",
    borderRadius: "6px 6px 0 0",
    boxShadow: `0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.02),
    0 16px 32px rgba(0, 0, 0, 0.02)`,
  },
  showLeaveButton: true,
  showFullscreenButton: true,
  url: ''
}

const DEFAULT_HEIGHT: number = 400;

interface EndCallFunc {
  (): void
}

interface MeetingRoomProps {
  currentUser: CurrentUserType
  meetingToken: string
  roomUrl: string
  endCall: EndCallFunc
}

const MeetingRoom: FunctionComponent<MeetingRoomProps> = ({ currentUser, roomUrl, endCall, meetingToken }) => {
  const videoRef = useRef(null);
  const [height, setHeight] = useState<number>(DEFAULT_HEIGHT);
  const [callframe, setCallframe] = useState(null);
  const [currentView, setCurrentView] = useState("loading"); // loading | call | waiting | error | left-call
  const [isLoading, setIsLoading] = useState(true);
    
  useEffect(() => {
    if (!videoRef?.current || !roomUrl || callframe) return;
    CALL_OPTIONS.url = roomUrl

    const newCallframe = DailyIframe.createFrame(
      videoRef.current,
      CALL_OPTIONS
    )

    setCallframe(newCallframe);
    
    const joinedMeeting = () => {
      console.log("join")
      if (currentView !== "call") {
        setCurrentView("call");
        setHeight((videoRef?.current?.clientWidth || 500) * 0.75);
      }
    }
    const participantUpdated = (e) => {
      console.log("someone join")
      if (!["call", "left-call"].includes(currentView)) {
        setCurrentView("call");
        setHeight((videoRef?.current?.clientWidth || 500) * 0.75);
      }
    }
    const leftMeeting = () => {
      console.log("left")
      setCurrentView("left-call");
      endCall()
    }
    const handleError = (err: any) => {
      console.log(err)
      alert(err.errorMsg)
      setCurrentView("left-call");
    }

    newCallframe
      .on("joined-meeting", joinedMeeting)
      .on("participant-updated", (e) => participantUpdated(e))
      .on("left-meeting", leftMeeting)
      .on("error", handleError);

    return () => {
      newCallframe
        .off("joined-meeting", joinedMeeting)
        // .off("left-meeting", leftMeeting)
    };
  }, [videoRef, callframe]);

  const joinRoom = useCallback(() => {
    if (!videoRef?.current || !callframe) return;
    callframe
      .join({ 
        userName: currentUser.username,
        token: meetingToken
      })
      .then(() => {
        setIsLoading(false)
        setHeight((videoRef?.current?.clientWidth || 500) * 0.75);
        setCurrentView("call");
        console.log("join meeting successful");
      })
      .catch((err: any) => {
        console.error(err)
      });
  }, [videoRef, callframe]);

  useEffect(() => {
    const state = callframe?.meetingState();
    console.log("state: ",state)
    if (state === "joined-meeting") {
      setCurrentView("call");
    }

    setCurrentView("loading");
    if (callframe) {
      joinRoom();
    }
  }, [videoRef, callframe, joinRoom]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    // handles setting the iframe's height on window resize to maintain aspect ratio
    const updateSize = () => {
      if (!videoRef?.current) return;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setHeight((videoRef?.current?.clientWidth || 500) * 0.75);
      }, 100);
    };

    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  
  if (!currentUser) {
    return <Redirect to={{ pathname: routes.home }} />
  }
  return (
    <PageStyle>
      <VideoContainer height={height} hidden={currentView !== "call"}>
        <Callframe ref={videoRef} />
      </VideoContainer>
      {(isLoading && currentView !== "call") &&
        <p>Loading...</p>
      }
    </PageStyle>
  )
}



export default MeetingRoom;