import React, { useState } from 'react';
import { Switch, Route } from "react-router-dom";
import { routes } from './routes';
import { AppContainer } from './styled';
import Home from './views/Home';
import Lounge from './views/Lounge';

export interface CurrentUserType {
  id: string
  username: string
  [key: string]: any
}

function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>(null)
  
  return (
    <AppContainer>
      <nav>
        <h2>Demo</h2>
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



export default App;
