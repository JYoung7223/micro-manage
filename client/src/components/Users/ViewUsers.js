import React, { useEffect, useState, useContext } from "react";
import {redirectToLogin, UserContext} from "../../utils/userContext";
import API from "../../utils/API";

function ViewUsers(props) {    
    const { user }  = useContext(UserContext);
    const [ users, setUsers] = useState([]);
    
    // get the users
    const getUsers = async ()=>{
        await API.viewUsers()
            .then((res)=>{                    
                setUsers(res.data);
            })
            .catch((error)=>{
                console.log("Something Happened:",error);
                alert(error);
            });
    };
    
    useEffect( () => {
        if(!user){
            return redirectToLogin();
        }   
        getUsers();
    }, []);

    return (        
        <article className="col-sm-9 animate__animated" id="userResults">            
            <table className="table table-striped" id="userTable">
                <thead className="bg-company-secondary" id="tableHeader">
                    <tr id="headerRow">
                        <th id="userHeader">User</th>
                        <th id="emailHeader">Email</th>
                        <th id="activeHeader">Active</th>
                        <th id="editHeader"></th>                
                    </tr>
                </thead>
                <tbody id="tableBody">                    
                    {users.map((user)=>{
                        return (
                            <tr id={user._id}>
                                <td id={`${user._id}_name`}>{`${user.firstname} ${user.middlename} ${user.lastname}`}</td>
                                <td id={`${user._id}_email`}>{user.email}</td>
                                <td id={`${user._id}_active`}>{user.active ? ("Active"):("Disabled")}</td>
                                <td id={`${user._id}_edit`}><a href={`/users/${user._id}`}>Click Here To Edit</a></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </article>
    );
}

export {
    ViewUsers
};