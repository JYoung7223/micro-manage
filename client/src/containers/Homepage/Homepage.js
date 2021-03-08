import React from 'react';
import './Homepage.css';
import ChecklistManagement from "../ChecklistManagment/ChecklistManagement";

/**
 * Talk about what this app allows you to do
 */
const Homepage = (props) => {

	return (
		<div className="container-fluid">
			<ChecklistManagement/>
		</div>
	)
}

export default Homepage;