import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from './containers/Homepage/Homepage';
import Nav from './components/Nav';
import Checklist from './components/Checklist/Checklist';

function App() {
  return (
    <Router>
      <div id="app">
        <Nav />
        <div className={'container-fluid'}>
          <Switch>
            {/* What should the homepage be? */}
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route exact path="/checklist/:id">
              <Checklist />
            </Route>
            <Route>
              {/* <NoMatch /> */}
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
