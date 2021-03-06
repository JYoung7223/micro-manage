import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import API from "../../utils/API";
import { UserContext } from "../../utils/userContext";

function Login(props) {
    const emailRef = useRef();
    const passRef = useRef();
    const userContext = useContext(UserContext);     
    const history = useHistory();

    const handleLogin = async (event) => {
        event.preventDefault();

        // Animate button click
        // await animateCSS('#login','bounce');

        // Collect values from the login form
        if (emailRef.current.value && passRef.current.value) {
            const response = await API.loginUser(
                { 
                    "email": emailRef.current.value,
                    "password": passRef.current.value 
                }
                )
                .then((res)=>{
                    console.log("Login Good:",res);
                    userContext.setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    
                })
                .then(()=>{
                    document.location.replace("/users/");
                })
                .catch((error)=>{
                    console.log("Something Happened:",error);
                    alert(error);
                });
        }
    };

    return (
        <section className="container text-center">
            <div className="row">
                <h2 className="col" id="loginHeader">Login</h2>
            </div>
            <form className="form login-form" id="loginForm" onSubmit={handleLogin}>
                <div className="row">
                    <div className="col text-end" id="emailLabel">Email:</div>
                    <input className="col form-control" type="email" id="email-login" ref={emailRef}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="passwordLabel">Password:</div>
                    <input className="col form-control" type="password" id="password-login" ref={passRef}/>
                </div>
                <button className="col btn btn-primary" type="submit" id="login">Login</button>
            </form>
            <div className="row">
                <p>New User? <a href="/users/signup" id="signup">Sign-Up Instead</a></p>
            </div>
        </section>
    );
}

export {
    Login
};