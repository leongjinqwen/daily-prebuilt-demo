import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router";
import { LoungeContainer } from "./styled";
import api from '../../src/utils/videoCallHelper'
import { routes } from "../routes";
import MeetingRoom from "./MeetingRoom";
import Avatar from 'react-avatar'


const Lounge = ({ currentUser }) => {
  const { search } = useLocation();
  const [rooms, setRooms] = useState([])
  const [participants, setParticipants] = useState(null)
  const [startVideoCall, setStartVideoCall] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState("")
  const [meetingToken, setMeetingToken] = useState("")

  useEffect(() => {
    if (search && search.match(/^[?t=*+]/)) {
    // remove the first few characters to isolate the token
      const token = search.replace("?t=", "");
      console.log("admin")

      // validate the token from the URL if supplied
      return api
        .verifyToken(token)
        .then((result) => {
          console.log(result)
          if (result.is_owner) {
            setMeetingToken(token)
            return;
          }
        })
        .catch((error) => {
          console.log('Error verify token', error);
        })
    } else {
      console.log("regular attendee")

      // set the participant to a regular attendee
      setMeetingToken("")
    }
  }, [search]);

  useEffect(() => {
    return api
      .fetchRooms()
      .then((result) => {
        setRooms(result.data)
      })
      .catch((error) => {
        console.log('Error creating room', error);
      })
  }, []);

  const updateParticipants = () => {
    return api
      .fetchParticipants()
      .then((result) => {
        // console.log("participant",result)
        setParticipants(result)
      })
      .catch((error) => {
        console.log('Error creating room', error);
      })
  }

  useEffect(() => {
    updateParticipants()
    const intervalId = setInterval(() => {
      updateParticipants()
    }, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const enterRoom = (url) => {
    console.log(url)
    setStartVideoCall(true)
    setMeetingUrl(url)
  }
  const endCall = () => {
    setStartVideoCall(false)
    setMeetingUrl("")
  }

  if (!currentUser) {
    return <Redirect to={{ pathname: routes.home }} />
  }
  return (
    startVideoCall ? 
      <MeetingRoom currentUser={currentUser} roomUrl={meetingUrl} endCall={endCall} meetingToken={meetingToken} />
      :
      <LoungeContainer>
        <header>
          <h1>Lounge</h1>
          <h3>Interact with other attendees in the lounge!</h3>
        </header>
        <div className="rooms-grid">
          {rooms?.map((room, idx) => (
            <div className="room" key={`room-${room.name}`}>
              <h4>Room: {idx+1} (Max: {room.config.max_participants})</h4>
              {(participants && participants[room.name]?.length > 0) &&
                <div className="participants-container">
                  {participants[room.name]?.sort((a,b)=>new Date(a.joinTime)-new Date(b.joinTime)).map((user, index)=>{
                    if (index < room.config.max_participants) 
                      return (
                        <div key={user.id}>
                          <Avatar name={user.userName} size='40' round />
                        </div>
                      )
                    else return null
                  })}
                </div>
              }
              {participants && participants[room.name]?.length >= room.config.max_participants 
                ? <p><strong>FULL</strong></p>
                : <p className="action-btn" onClick={()=>enterRoom(room.url)}>Take a seat</p>
              }
            </div>
          ))}
        </div>
      </LoungeContainer>
  )
}



export default Lounge;