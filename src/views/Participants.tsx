import React, { FunctionComponent } from "react";
import Avatar from 'react-avatar'

interface ParticipantsProps {
  maxLimit: number
  users: {
    id: string
    userName: string
    joinTime: string
  }[] 
}

const Participants: FunctionComponent<ParticipantsProps> = ({ users, maxLimit }) => {
  return (
    <div className="participants-container">
      {users?.sort((a,b)=> +new Date(a.joinTime) - +new Date(b.joinTime)).map((user, index)=>{
        if (index < maxLimit) 
          return (
            <div key={user.id}>
              <Avatar name={user.userName} size='40' round />
            </div>
          )
        else return null
      })}
    </div>
  )
}



export default Participants;