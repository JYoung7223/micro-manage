import React, {useContext, useEffect} from "react";
import { EditUser } from "./EditUser";
import {redirectToLogin, UserContext} from "../../utils/userContext";

function Profile(props) {
    const { user }  = useContext(UserContext);

    useEffect( () => {
        if(!user)
            return redirectToLogin();
    }, []);

    return (
        <section className="container">
            <div className="row">
                <div className="col-auto mx-auto">
                    <h2>Welcome, {user.firstname}!</h2>
                </div>
            </div>
            <div className="row">
                {/* Left column section */}
                <section className="col-sm-3 bg-company-secondary">
                </section>
                {/* Main content section */}
                <EditUser></EditUser>
                {/* Right column section */}
            </div>
        </section>
    );
}

export {
    Profile
};