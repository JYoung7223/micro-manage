import React, { useRef } from "react";
import API from "../../utils/API";

function Signup(props) {
    const firstRef = useRef();
    const middleRef = useRef();
    const lastRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();
    const confirmPassRef = useRef();

    const handleSignup = async (event) => {
        event.preventDefault();

        // Animate button click
        // await animateCSS('#signUp','bounce');

        // Collect values from the signup form
        if (passRef.current.value !== confirmPassRef.current.value) {
            alert('Passwords do not match.');
        } else if (firstRef.current.value && emailRef.current.value && passRef.current.value && confirmPassRef.current.value) {
            const response = await API.createUser(
                {
                    "firstname": firstRef.current.value,
                    "middlename": middleRef.current.value,
                    "lastname": lastRef.current.value,
                    "email": emailRef.current.value,
                    "password": passRef.current.value,
                    "active": true,
                    "roles": []
                }
            );
            console.log("response:", response);
            if (response.ok) {
                document.location.replace('/');
            } else {
                alert(response.statusText);
            }
        }
    };

    return (
        <section className="container text-center">
            <div className="row">
                <h2 className="col" id="signupHeader">Signup</h2>
            </div>
            <form className="form signup-form" id="signupForm" onSubmit={handleSignup}>
                <div className="row">
                    <div className="col text-end" id="firstnameLabel">First Name:</div>
                    <input className="col form-control" type="text" id="firstname-signup" ref={firstRef}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="middlenameLabel">Middle Name:</div>
                    <input className="col form-control" type="text" id="middlename-signup" ref={middleRef}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="lastnameLabel">Last Name:</div>
                    <input className="col form-control" type="text" id="lastname-signup" ref={lastRef}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="emailLabel">Email:</div>
                    <input className="col form-control" type="email" id="email-signup" ref={emailRef}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="passwordLabel">Password:</div>
                    <input className="col form-control" type="password" id="password-signup" ref={passRef}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="confirmLabel">Confirm Password:</div>
                    <input className="col form-control" type="password" id="password-confirm" ref={confirmPassRef}/>
                </div>
                <button className="col btn btn-primary" type="submit" id="signUp">Sign-Up</button>
            </form>
            <div className="row">
                <p>Already a Member? <a href="/users/login" id="login">Login Instead</a></p>
            </div>
        </section>
    );
}

export {
    Signup
};