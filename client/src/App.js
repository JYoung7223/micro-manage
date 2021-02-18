import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from './containers/Homepage/Homepage';
import Nav from './components/Nav';

function App() {
  return (
    <Router>
      <div id="app">
        <Nav />
        <Switch>
          {/* What should the homepage be? */}
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/checklist/:id">
            {/* <Checklist /> */}
          </Route>
          <Route>
            {/* <NoMatch /> */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
