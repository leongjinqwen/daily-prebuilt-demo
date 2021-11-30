import React, { Dispatch, FunctionComponent, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { CurrentUserType } from "../App";
import { routes } from "../routes";

interface HomeProps {
  setCurrentUser: Dispatch<React.SetStateAction<CurrentUserType>>
  currentUser: CurrentUserType,
}


const Home: FunctionComponent<HomeProps> = ({ setCurrentUser, currentUser }) => {
  const history = useHistory()
  const [nameInput, setNameInput] = useState('')

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcyI6dHJ1ZSwibyI6dHJ1ZSwiZCI6IjJkNGMxYzQ4LTYzODUtNDYyNy1hNTU3LWU3ZjI2NDZiMmM2ZSIsImlhdCI6MTYzODI0MTYwMn0.dyhqcT9_VgYOVnPOEJwnDoOF-Y25QguefGTQERNZf_4"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value)
  }
  
  if (currentUser) {
    return <Redirect to={{ pathname: routes.lounge }} />
  }
  return (
    <>
      <h3>Username : </h3>
      <form onSubmit={handleSubmit}>
        <input value={nameInput} onChange={handleNameInput} />
        <button type="submit">Confirm</button>
      </form>
    </>
  )
}



export default Home;