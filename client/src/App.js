import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "./components/Header";
import Nav from "./components/Nav";
import Homepage from "./containers/Homepage/Homepage";
import Checklist from "./components/Checklist/Checklist";
import { Profile } from "./containers/Users/Profile";
import { Login } from "./containers/Users/Login";
import { Signup } from "./containers/Users/Signup";
import { Footer } from "./components/Footer";
import { UserContext } from "./utils/userContext";
import Introduction from "./components/Introduction/Introduction";

function App() {

  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
      <Router>
        <div id="app">
          <Nav />
          <div id="page" className={'container-fluid grey-background'}>
            <Switch>
              {/* What should the homepage be? */}
              <Route exact path="/">
                <Introduction />
              </Route>
                <Route exact path="/checklist-management">
                    <Homepage />
                </Route>
              <Route exact path="/checklist/:id">
                <Checklist />
              </Route>

              {/* User Related Pages */}
              <Route exact path="/users/login/">
                <Login />
              </Route>
              <Route exact path="/users/signup/">
                <Signup />
              </Route>
              <Route exact path="/users/">
                <Profile />
              </Route>
              <Route exact path="/users/:id">
                {/* <Users /> */}
              </Route>

              <Route>{/* <NoMatch /> */}</Route>
            </Switch>
          </div>
        </div>
      </Router>
      <Footer />
    </UserContext.Provider>
  );
}

export default App;
