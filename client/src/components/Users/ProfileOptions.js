import React, {useContext, useEffect} from "react";
import {redirectToLogin, UserContext} from "../../utils/userContext";
import API from "../../utils/API";

function ProfileOptions(props) {
    const { user }  = useContext(UserContext);

    useEffect( () => {
        if(!user)
            return redirectToLogin();
    }, []);

    return (        
        // Administrator Items Only 
        <div className="form-group row">
            <p><a className="btn text-white" href="/users/" id="viewUsers">View Users</a></p>
        </div>
    );
}

export {
    ProfileOptions
};