import * as React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
  } from 'react-router-dom';

import Home from './components/Home';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import Medias from './components/Medias';
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
                            to="/medias" 
                            activeClassName="active">
                            Medias
                        </NavLink>
                        <NavLink 
                            className="nav-link"
                            to="/upload" 
                            activeClassName="active">
                            Upload
                        </NavLink>
                    </nav>
                </div>
            </header>
            <Switch>
                <Route path="/gallery">
                    <Gallery galleryTitle="Mariages"/>
                </Route>
                <Route path="/upload">
                    <Upload />
                </Route>
                <Route path="/medias">
                    <Medias />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
            <footer className="mt-auto text-white-50">
                <p>Full React Photography Portfolio, by Totor.</p>
            </footer>
        </Router>
      </React.Fragment>
    );
  }

  export default App;

