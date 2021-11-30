import React, { useState } from 'react';
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { routes } from './routes';
import Home from './views/Home';
import Lounge from './views/Lounge';
// import WebinarCall from "./views/WebinarCall";

function App() {
  // const [currentUser, setCurrentUser] = useState({username: "Jinq Wen"})
  const [currentUser, setCurrentUser] = useState(null)
  const [copyUrl, setCopyUrl] = useState('')
  
  return (
    <AppContainer>
      <nav>
        <h2>Demo</h2>
        {copyUrl &&
          <h3>{copyUrl}</h3>
        }
        {currentUser &&
          <h2>Hi, {currentUser.username}!</h2>
        }
      </nav>
      <Switch>
        <Route exact path={routes.home} component={(props) => <Home setCurrentUser={setCurrentUser} currentUser={currentUser} {...props} />} />

        <Route path="/lounge" component={(props) => <Lounge currentUser={currentUser} {...props} />} />
      </Switch>
    </AppContainer>
  )
}

const AppContainer = styled.div`
  width: 100%;
  height: calc(100vh - 52px);
  top: 52px;
  background-color: #f7f9fa;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  line-height: 16px;

  nav {
    min-width: 100%;
    height: 52px;
    background-color: white;
    position: fixed;
    z-index: 1000;
    top: 0;
    box-shadow: inset 0px -1px 0p #c8d1dc;
    border-bottom: 1px solid #c8d1dc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      padding: 0 24px;
      margin: 0;
    }
  }
  form {
    display: flex;
    input {
      padding: 6px 4px;
      font-size: 12px;
      outline: none;
      width: 175px;
      border-radius: 0;
      border: 1px solid lightgray;
    }
    button {
      background-color: #2b3f56;
      border: none;
      border-radius: 0;
      color: white;
      padding: 6px 18px;
    }
  }

`

export default App;
