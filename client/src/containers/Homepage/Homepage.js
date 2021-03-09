import React from 'react';
import './Homepage.css';
import ChecklistManagement from "../ChecklistManagment/ChecklistManagement";

/**
 * Talk about what this app allows you to do
 */
const Homepage = (props) => {

	return (
		<div className="container-fluid" style={ {padding: '30px 15px 0px 15px'} }>
			<h2 className={'text-center'}>Checklist Management</h2>
			<ChecklistManagement/>
		</div>
	)
}

export default Homepage;