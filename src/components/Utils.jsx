import * as React from 'react'
import { Route, Redirect } from 'react-router-dom';

export const Loading = () => {
    return <React.Fragment>
        <h1>Loading...</h1>
        <p>(This app is served by an API on another Heroku server.</p>
        <p>Please wait a few seconds for first loading.)</p>
    </React.Fragment>
}

export const RootUrl = () => {
    // return "https://portfolio-photographie-api.herokuapp.com/"
    // return "http://localhost:8000/"
    return ""
}

export const PrivateRoute = ({ children, isAuth, ...rest }) => {
    return (
      <Route {...rest} render={({location}) => {
        // console.log(location)
        return (isAuth === true) ? children : <Redirect to={{
          pathname: '/login',
          state: {from: location} 
        }}/>
      }} />
    )
}