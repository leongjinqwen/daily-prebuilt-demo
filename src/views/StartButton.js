import React from "react";
import { StartContainer } from "./styled";



const StartButton = ({ hidden, urlInput, handleCreateRoom, handleUrlInput, submitUrl }) => {
  return (
    <StartContainer hidden={hidden}>
      <button onClick={handleCreateRoom}>
        Create Room
      </button>
      <h4>Enter my room URL</h4>
      <div className="url-form">
        <input value={urlInput} onChange={(e)=>handleUrlInput(e)} />
        <button className="join-btn" onClick={submitUrl}>
          Join
        </button>
      </div>
    </StartContainer>
  )
}



export default StartButton;