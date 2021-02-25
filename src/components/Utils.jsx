import * as React from 'react'

export const Loading = () => {
    return <React.Fragment>
        <h1>Loading...</h1>
        <p>(This app is served by an API on another Heroku server.</p>
        <p>Please wait a few seconds for first loading.)</p>
    </React.Fragment>
}

export const RootUrl = () => {
    // return "https://portfolio-photographie-api.herokuapp.com/"
    return "http://localhost:8000/"
}