import React, {useRef, useState, useContext, useEffect} from "react";
import API from "../../utils/API";
import {redirectToLogin, redirectToProfile, UserContext} from "../../utils/userContext";

function Login(props) {
    const emailRef = useRef();
    const passRef = useRef();
    const loginAudioRef = useRef();
    const welcomeAudioRef = useRef();
    const userContext = useContext(UserContext);     

    useEffect( () => {
        if(userContext.user?._id){
            return redirectToProfile();
        }
        if(loginAudioRef.current){
            loginAudioRef.current.src="/sounds/letmein.wav";
            loginAudioRef.current.play();
        }

    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        // Animate button click
        // await animateCSS('#login','bounce');

        // Collect values from the login form
        if (emailRef.current.value && passRef.current.value) {
            await API.loginUser(
                { 
                    "email": emailRef.current.value,
                    "password": passRef.current.value 
                }
                )
                .then((res)=>{
                    welcomeAudioRef.current.src="/sounds/hey-you-guys.mp3";
                    welcomeAudioRef.current.play();
                    welcomeAudioRef.current.onended=()=>{
                        document.location.replace(`/Users/${res.data._id}`);
                    };
                    userContext.setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));                                        
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
                    <div className="col my-auto text-end" id="emailLabel">Email:</div>
                    <input className="col form-control" type="email" id="email-login" ref={emailRef}/>
                </div>
                <div className="row">
                    <div className="col my-auto text-end" id="passwordLabel">Password:</div>
                    <input className="col form-control" type="password" id="password-login" ref={passRef}/>
                </div>
                <audio id="loginAudio" ref={loginAudioRef}></audio>
                <audio id="welcomeAudio" ref={welcomeAudioRef}></audio>
                <button className="my-3 btn btn-primary" type="submit" id="login">Login</button>
            </form>
            <div className="row">
                <p className="mx-auto">New User? <a href="/users/signup" id="signup">Sign-Up Instead</a></p>
            </div>
        </section>
    );
}

export {
    Login
};