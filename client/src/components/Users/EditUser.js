import React, { useRef, useState, useContext, useEffect } from "react";
import {redirectToLogin, UserContext} from "../../utils/userContext";
import API from "../../utils/API";

function EditUser(props) {
    const idRef = useRef();
    const firstRef = useRef();
    const middleRef = useRef();
    const lastRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();
    const confirmPassRef = useRef();
    const { user } = useContext(UserContext);
    const [ editUser, setEditUser] = useState(user);

    // get the users
    const getUser = async ()=>{
        // Check if the edit user is this user or selected user
        const editUserId = document.location.pathname.split("/")[2];
        
        if(editUserId){
            await API.viewUser(editUserId)
                .then((res)=>{                    
                    setEditUser(res.data);
                })
                .catch((error)=>{
                    // console.log("Something Happened:",error);
                    // alert(error);
                });
        }
    };

    useEffect( () => {
        if(!user){
            return redirectToLogin();
        }   
        getUser();
    }, []);

    const handleUpdate = async (event) => {
        event.preventDefault();

        // Animate button click
        // await animateCSS('#updateUser','bounce');

        // Collect values from the updateUser form
        if (passRef.current.value !== confirmPassRef.current.value) {
            alert('Passwords do not match.');
        } else {
            const userData = {};
            if(firstRef.current.value){
                userData.firstname = firstRef.current.value;
            }
            if(middleRef.current.value){
                userData.middlename = middleRef.current.value;
            }
            if(lastRef.current.value){
                userData.lastname = lastRef.current.value;
            }
            if(emailRef.current.value){
                userData.email = emailRef.current.value;
            }
            if(passRef.current.value){
                userData.password = passRef.current.value;
            }

            const response = await API.updateUser(idRef.current.value,
                userData
            );
            console.log("response:", response);
            if (response.ok) {
                document.location.replace(`/Users/${response.data.id}`);
            } else {
                alert(response.statusText);
            }
        }
    };

    return (
        <section className="col-sm-9">
            <div className="row">
                <h2 className="col text-center" id="editUserHeader">Update {editUser.firstname}</h2>
            </div>
            <form className="form user-form" id="userForm" onSubmit={handleUpdate}>
                <div className="row">
                    <div className="col text-end" id="firstnameLabel">First Name:</div>
                    <input className="col form-control" type="text" id="firstname-user" ref={firstRef} placeholder={editUser.firstname}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="middlenameLabel">Middle Name:</div>
                    <input className="col form-control" type="text" id="middlename-user" ref={middleRef} placeholder={editUser.middlename}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="lastnameLabel">Last Name:</div>
                    <input className="col form-control" type="text" id="lastname-user" ref={lastRef} placeholder={editUser.lastname}/>
                </div><div className="row">
                    <div className="col text-end" id="emailLabel">Email:</div>
                    <input className="col form-control" type="email" id="email-user" ref={emailRef} placeholder={editUser.email}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="passwordLabel">New Password:</div>
                    <input className="col form-control" type="password" id="password-user" ref={passRef}/>
                </div>
                <div className="row">
                    <div className="col text-end" id="confirmLabel">Confirm New Password:</div>
                    <input className="col form-control" type="password" id="password-confirm" ref={confirmPassRef} />
                </div>       
                <div className="row">
                    <input type="hidden" id="user_id" ref={idRef} value={editUser._id} />
                    <button className="mx-auto my-3 col-auto btn btn-primary" type="submit" id="updateUser">Update User</button>
                </div>
            </form>
        </section >
    );
}

export {
    EditUser
};