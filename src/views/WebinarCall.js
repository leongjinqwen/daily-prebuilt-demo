import React, { useRef, useEffect, useState, useCallback } from "react";
import DailyIframe from "@daily-co/daily-js";
import { VideoContainer, Callframe, PageStyle } from "./styled";
import api from '../../src/utils/videoCallHelper'
import StartButton from "./StartButton";
import { Redirect } from "react-router";
import { routes } from "../routes";

const CALL_OPTIONS = {
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
  //   showLocalVideo: false,
  //   showParticipantsBar: false,
}

const DEFAULT_HEIGHT = 400;

const WebinarCall = ({ currentUser, setCopyUrl }) => {
  const videoRef = useRef(null);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [callframe, setCallframe] = useState(null);
  const [currentView, setCurrentView] = useState("loading"); // loading | call | waiting | error | left-call
  const [urlInput, setUrlInput] = useState("")
  const [roomInfo, setRoomInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("user:", currentUser)
    console.log("trigger")
    console.log("videoref: ",videoRef)
    console.log("room info: ",roomInfo)
    console.log("callframe: ", callframe)
    console.log("loading: ", isLoading)
    if (!videoRef?.current || !roomInfo?.url || callframe) return;
    CALL_OPTIONS.url = roomInfo?.url

    const newCallframe = DailyIframe.createFrame(
      videoRef.current,
      CALL_OPTIONS
    )

    setCallframe(newCallframe);
    console.log("hit here")
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
      setRoomInfo(null);
      setCopyUrl('')
      setCurrentView("left-call");
    }

    newCallframe
      .on("joined-meeting", joinedMeeting)
      .on("participant-updated", (e) => participantUpdated(e))
      .on("left-meeting", leftMeeting)

    return () => {
      newCallframe
        .off("joined-meeting", joinedMeeting)
        // .off("left-meeting", leftMeeting)
    };
  }, [videoRef, callframe, roomInfo]);

  const createCall = useCallback(() => {
    setIsLoading(true)

    return api
      .createRoom()
      .then((room) => {
        console.log(room.url)
        setRoomInfo({
          username: currentUser.username,
          url: room.url,
        })
        setCopyUrl(room.url)
        // joinRoom()
      })
      .catch((error) => {
        console.log('Error creating room', error);
        setRoomInfo(null);
        setCopyUrl('')
      })
  }, [])

  const handleUrlInput = (e) => {
    setUrlInput(e.target.value)
  }

  const submitUrl = () => {
    if (urlInput === "") {
      alert("Please enter room url.")
    } else {
      setIsLoading(true)
      console.log("setloading to true")
      setRoomInfo({
        username: currentUser.username, 
        url: urlInput.trim(),
      })
      console.log("setRoomInfo:", {
        username: currentUser.username, 
        url: urlInput.trim(),
      })
      setCopyUrl(urlInput.trim())
      setUrlInput("")
      // joinRoom()
    }
  }
  console.log(isLoading)
  console.log(roomInfo)

  const joinRoom = useCallback(() => {
    console.log("trigger Join Room")
    if (!videoRef?.current || !callframe) return;
    callframe
      .join({ userName: currentUser.username })
      .then(() => {
        setIsLoading(false)
        setHeight((videoRef?.current?.clientWidth || 500) * 0.75);
        setCurrentView("call");
        console.log("join meeting successful");
      })
      .catch((err) => console.error(err));
  }, [roomInfo, videoRef, callframe]);

  useEffect(() => {

    const state = callframe?.meetingState();
    console.log("state: ",state)
    if (state === "joined-meeting") {
      setCurrentView("call");
    }
    if (!roomInfo) return;
    console.log("Hit check state")
    setCurrentView("loading");
    if (callframe) {
      joinRoom();
    }
  }, [roomInfo, videoRef, callframe, joinRoom]);

  useEffect(() => {
    let timeout;

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
      {isLoading && currentView !== "call" ?
        <p>Loading...</p>
        :
        <StartButton hidden={currentView === "call"} handleCreateRoom={createCall} handleUrlInput={handleUrlInput} urlInput={urlInput} submitUrl={submitUrl} />
      }
    </PageStyle>
  )
}



export default WebinarCall;