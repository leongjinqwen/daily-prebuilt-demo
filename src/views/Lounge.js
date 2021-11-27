import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { LoungeContainer } from "./styled";
import api from '../../src/utils/videoCallHelper'
import { routes } from "../routes";
import MeetingRoom from "./MeetingRoom";
import Avatar from 'react-avatar'


const Lounge = ({ currentUser }) => {
  const [rooms, setRooms] = useState([])
  const [participants, setParticipants] = useState(null)
  const [startVideoCall, setStartVideoCall] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState("")

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
        console.log("participant",result)
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
    }, 10000)
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
      <MeetingRoom currentUser={currentUser} roomUrl={meetingUrl} endCall={endCall} />
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
                <ul>
                  {participants[room.name]?.map((user, index)=>(
                    <div key={user.id}>
                      <Avatar name={user.userName} size='40' round />
                    </div>
                  ))}
                </ul>
              }
              <p className="action-btn" onClick={()=>enterRoom(room.url)}>Take a seat</p>
            </div>
          ))}
        </div>
      </LoungeContainer>
  )
}



export default Lounge;