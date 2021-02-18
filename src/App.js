import * as React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
  } from 'react-router-dom';

import Home from './components/Home';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import './styles.css';

function App() {
    return (
      <React.Fragment>
        <Router>
            <header className="mb-auto">
                <div>
                    <h3 className="float-md-start mb-0">Portfolio Photographie</h3>
                    <nav className="nav nav-masthead justify-content-center float-md-end">
                        <NavLink 
                            className="nav-link"
                            exact to="/" 
                            activeClassName="active">
                            Home
                        </NavLink>
                        <NavLink 
                            className="nav-link"
                            to="/gallery" 
                            activeClassName="active">
                            Gallery
                        </NavLink>
                        <NavLink 
                            className="nav-link"
                            to="/contact" 
                            activeClassName="active">
                            Contact
                        </NavLink>
                    </nav>
                </div>
            </header>
            <Switch>
                <Route path="/gallery">
                    <Gallery />
                </Route>
                <Route path="/contact">
                    <Contact />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
            <footer className="mt-auto text-white-50">
                <p>Cover template for <a href="https://getbootstrap.com/" className="text-white">Bootstrap</a>, by <a href="https://twitter.com/mdo" class="text-white">@mdo</a>.</p>
            </footer>
        </Router>
      </React.Fragment>
    );
  }

  export default App;

