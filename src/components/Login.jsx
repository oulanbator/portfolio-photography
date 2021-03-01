import * as React from 'react'
import { RootUrl } from './Utils'
import { Redirect, useLocation } from 'react-router-dom';
import './login.css'

const ROOT_URL = RootUrl()

const LoginForm = ({onSubmit, loginError}) => {
    const handleSubmitClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // find data
        const email = document.querySelector("#user-email")
        const password = document.querySelector("#user-password")
        const remember = document.querySelector("#user-remember")
        // Build form
        let loginForm = new FormData()
        loginForm.append("email", email.value)
        loginForm.append("password", password.value)
        loginForm.append("remember", remember.checked)
        // Send form to submit callback
        onSubmit(loginForm)
    }
    console.log(loginError)
    return <React.Fragment>
        <form id="login-form" className="mb-4">
            <div className="mb-3">
                <label htmlFor="user-email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="user-email"/>
            </div>
            <div className="mb-3">
                <label htmlFor="user-password" className="form-label">Password</label>
                <input type="password" className="form-control" id="user-password"/>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="user-remember"/>
                <label className="form-check-label" htmlFor="user-remember">Remember me</label>
            </div>
            {loginError ? <p className="text-danger">Failed to login. Please check email and password.</p> : null}
            <button type="submit" className="btn btn-primary" onClick={handleSubmitClick}>Submit</button>
        </form>
    </React.Fragment>
}

const Login = ({onLogin}) => {
    const [redirectToReferrer, setRedirectToReferrer] = React.useState(false)
    const [authError, setAuthError] = React.useState(false)
    const { state } = useLocation()
    // console.log(state)

    const handleSubmit = (form) => {
        // Initialize request
        let request = new XMLHttpRequest()
        // Initialize Callback for processing server response
        const checkStatus = () => {
            // When request state is "over" (4)
            if (request.readyState == 4) {
                // Parse response and ...
                const serverResponse = JSON.parse(request.response)
                console.log(serverResponse)
                // If success, Login
                if (serverResponse.status === 'login-success') {
                    onLogin()
                    setRedirectToReferrer(true)
                } else if (serverResponse.status === 'login-failed') {
                    setAuthError(true)
                }
                // Other options ?
            }
        }
        // Listen for request state changes = callback Checkstatus
        request.onreadystatechange = checkStatus
        // Build request parameters and send form
        request.open("POST", ROOT_URL + "api/login")
        request.send(form)
    }

    if (redirectToReferrer) {
        // return <Redirect to={state?.from || '/'} />
        return <Redirect to={state?.from.pathname || '/'} />
    }

    return <div>
        <h1>Login page</h1>
        <LoginForm onSubmit={handleSubmit} loginError={authError}/>
        {/* <button onClick={logout}>logout</button> */}
    </div>
}

export default Login;