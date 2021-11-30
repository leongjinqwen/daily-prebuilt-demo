import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { routes } from "../routes";

const Home = ({ setCurrentUser, currentUser }) => {
  const history = useHistory()
  const [nameInput, setNameInput] = useState('')

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcyI6dHJ1ZSwibyI6dHJ1ZSwiZCI6IjJkNGMxYzQ4LTYzODUtNDYyNy1hNTU3LWU3ZjI2NDZiMmM2ZSIsImlhdCI6MTYzODI0MTYwMn0.dyhqcT9_VgYOVnPOEJwnDoOF-Y25QguefGTQERNZf_4"

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nameInput.length === 0) {
      alert("Please enter your name.")
      return
    }
    setCurrentUser({
      ...currentUser,
      username: nameInput.trim()
    })
    if (nameInput.trim() === "Admin") {
      history.push(`/lounge?t=${token}`)
    } else {
      history.push(routes.lounge)
    }
  }
  
  if (currentUser) {
    return <Redirect to={{ pathname: routes.lounge }} />
  }
  return (
    <>
      <h3>Username : </h3>
      <form onSubmit={handleSubmit}>
        <input value={nameInput} onChange={(e)=>setNameInput(e.target.value)} />
        <button type="submit">Confirm</button>
      </form>
    </>
  )
}



export default Home;