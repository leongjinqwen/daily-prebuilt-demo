import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { routes } from "../routes";


const Test = ({ currentUser }) => {
  const [count, setCount] = useState(0)
  console.log(currentUser)


  const handleIncrement = () => {
    console.log("click!!")
    console.log("inside:",count)
    setCount(count+1)
  }
  console.log("outside:",count)

  if (!currentUser) {
    return <Redirect to={{ pathname: routes.home }} />
  }
  return (
    <>
      <button onClick={handleIncrement}>Increase</button>
    </>
  )
}



export default Test;