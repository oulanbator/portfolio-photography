import * as React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Redirect,
    useLocation,
    useHistory
  } from 'react-router-dom';

import Home from './components/Home';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import Login from './components/Login';
import Medias from './components/Medias';
import Manager from './components/GalleryManager';
import {RootUrl, Loading, PrivateRoute} from './components/Utils'
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ROOT_URL = RootUrl()

function App() {
  const [loading, setLoading] = React.useState(true)
  const [authenticated, setAuthenticated] = React.useState(false)

  // On mount, check if user already authenticated
  React.useEffect(() => {
    const url = ROOT_URL + "api/login"
    fetch(url).then(res => res.json()).then(data => {
      // if current_user authenticated, change auth state
      if (data.status === "already-login") {
        setAuthenticated(true)
      }
      // After checking auth, set loading false
      setLoading(false)
    });
  }, [])

  const handleLogin = () => {
    // If loggin form successful, change auth state
    setAuthenticated(true)
  }

  const handleLogout = (e) => {
    const url = ROOT_URL + "api/logout"
    // Fetch logout endpoint
    fetch(url).then(res => res.json()).then(data => {
      // If API returns success change auth state
      if (data.status === "logout-success") {
        setAuthenticated(false)
      }
    });
  }
  // If loading state, return loading component
  if (loading) {
    return <Loading/>
  }
  return (
    <React.Fragment>
      <Router>
          <header className="mb-auto">
              <div>
                  <h3 className="float-md-start mb-0">Portfolio Photographie</h3>
                  {/* Public Navigation */}
                  <nav className="nav nav-masthead justify-content-center float-md-end">
                    <NavLink className="nav-link" exact to="/" activeClassName="active">Home</NavLink>
                    <NavLink className="nav-link" to="/gallery" activeClassName="active">Gallery</NavLink>
                    {/* Login/Logout switch link */}
                    {(!authenticated) ?
                    <NavLink className="nav-link" to="/login" activeClassName="active">Login</NavLink> :
                    <NavLink className="nav-link" to='/logout' onClick={handleLogout} activeClassName="active">Logout</NavLink>}
                  </nav>
                  {/* Admin Navigation */}
                  {(authenticated) ?
                  (<nav className="nav nav-masthead nav-admin justify-content-center float-md-end">
                    <NavLink className="nav-link" to="/galleryManager" activeClassName="active">Gallery Manager</NavLink>
                    <NavLink className="nav-link" to="/medias" activeClassName="active">Medias</NavLink>
                    <NavLink className="nav-link" to="/upload" activeClassName="active">Upload</NavLink>
                  </nav>)
                  :null}
              </div>
          </header>
          <Switch>
            {/* Public front Routes */}
              <Route exact path="/"><Home /></Route>
              <Route path="/gallery"><Gallery galleryTitle="Affiches"/></Route>
              <Route path="/login"><Login onLogin={handleLogin}/></Route>
              <Route exact path="/logout"><Redirect to={'/'}/></Route>
            {/* Private front Routes */}
              <PrivateRoute  isAuth={authenticated}>
                <Route path="/galleryManager"><Manager /></Route>
                <Route path="/medias"><Medias /></Route>
                <Route path="/upload"><Upload /></Route>
              </PrivateRoute>
          </Switch>
          <footer className="mt-auto text-white-50">
              <p>Full React Photography Portfolio, by Totor.</p>
          </footer>
      </Router>
    </React.Fragment>
  );
}

export default App;

