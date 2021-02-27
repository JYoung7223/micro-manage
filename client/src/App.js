import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Homepage from "./containers/Homepage/Homepage";
import Checklist from "./components/Checklist/Checklist";
import Profile from "./containers/Users/Profile";
import Users from "./containers/Users/Users";
import Login from "./containers/Users/Login";
import Signup from "./containers/Users/Signup";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header/>
      <Router>
        <div id="app">
          <Nav />
          <Switch>
            {/* What should the homepage be? */}
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route exact path="/checklist/:id">
              <Checklist />
            </Route>

            {/* User Related Pages */}
            <Route exact path="/users/">
              <Profile />
            </Route>
            <Route exact path="/users/:id">
              <Users />
            </Route>
            <Route exact path="/login/">
              <Login />
            </Route>
            <Route exact path="/signup/">
              <Signup />
            </Route>

            <Route>{/* <NoMatch /> */}</Route>
          </Switch>
        </div>
      </Router>
      <Footer/>
    </>
  );
}

export default App;
