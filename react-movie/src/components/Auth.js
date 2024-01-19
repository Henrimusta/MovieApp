import {useState } from "react";

import { jwtToken, userData } from "./Signals";
import axios from "axios";
import RegistrationForm from "../SignIn";
import '../styles/Settings.css';
function Login() {

    return (
      <div>
        <UserInfo/>
        { jwtToken.value.length === 0 ? <LoginForm/> : 
          <button onClick={() => jwtToken.value = ''}>Logout</button>}
      </div>
    );
  }

  function UserInfo(){

    return(
      <div>
        {jwtToken.value ? <h1>{userData.value?.private}</h1> : <div className="status-message"><h1>You are guest</h1></div>}
      </div>
    )
  }
  

  function LoginForm(){

    const [uname, setUname] = useState('');
    const [pw, setPw] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to hold error message

    const handleSubmit = (event) => {
      event.preventDefault(); // Prevents the default form submission behavior
      login();
  };
    
    function login(){
      axios.postForm('http://localhost:3001/user/login', {uname,pw})
      .then(resp => {
        jwtToken.value = resp.data.jwtToken;
        localStorage.setItem('jwtToken', resp.data.jwtToken); // Storing the token in local storage
        setErrorMessage(''); // Clear any previous errors
      })
      .catch(error => { // Make sure 'error' is received here
        // Handle error response and set an error message
        const message = (error && error.response && error.response.data && error.response.data.error) 
                        ? error.response.data.error 
                        : "An error occurred during login.";
        setErrorMessage(message);
      });
  }

  return (
    <div>
        <div className="box login-box">
            <h3>Log In</h3>
            <form onSubmit={handleSubmit}> {/* Add the form tag here */}
                <label htmlFor="username">Username: </label>
                <input
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    value={uname}
                    onChange={e => setUname(e.target.value)}
                />
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                />
                {errorMessage && <div className="status-message">{errorMessage}</div>}
                <button type="submit">Login</button> {/* Ensure this is a submit button */}
            </form>
        </div>
        <RegistrationForm />
    </div>
);
}


export {Login};
