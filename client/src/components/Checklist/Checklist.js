import React, {useState, useEffect, useRef} from 'react';
import Table from '../Bootstrap/Table/Table';
import { DateTime } from "luxon";
import axios from "axios";
import './Checklist.scss';
import { useQuery } from "../../utils/useQuery";
import {useParams} from "react-router";

//Checklist schema
const columnHeadings = [
	{ label: 'Final Reviewed By', value: 'finalReview', style: {transform: 'rotate(90deg)'} },
	{ label: 'Final Reviewed Date', value: 'finalReviewDate', style: {transform: 'rotate(90deg)'}  },
	{ label: 'Reviewed By', value: 'review', style: {transform: 'rotate(90deg)'}  },
	{ label: 'Reviewed Date', value: 'reviewDate', style: {transform: 'rotate(90deg)'}  },
	{ label: 'Prepared By', value: 'prepare', style: {transform: 'rotate(90deg)'}  },
	{ label: 'Prepared Date', value: 'prepareDate', style: {transform: 'rotate(90deg)'}  },
	{ label: 'Explanation Ref', value: 'explanation', style: {transform: 'rotate(90deg)'}  },
	{ label: 'Template Ref', value: 'template', style: {transform: 'rotate(90deg)'}  },
	{ label: 'Line #', value: 'line' },
	{ label: 'Instruction / Detail', value: 'instruction', style: {minWidth: '600px'} },
]

const now = DateTime.now().toFormat('MM/dd');

/**
 * Loads in the checklist corresponding to the id passed
 * @param {checklistId, ...props}
 * @constructor
 */
const Checklist = ( {props} ) => {
    //state variables
	let [checklist, setChecklist] = useState({});
	let { id } = useParams();

	useEffect( () => {
		getChecklists();
	}, []);

	const getChecklists = async () => {
		let checklistResponse = await axios.get("/api/checklists/" + id);

		setChecklist(checklistResponse.data);
	};


	//useEffects(Lifecycle Methods)
    /**
     * ComponentDidMount: What should happen when this component is first loaded into the DOM
     */
    //Other Methods

    return (
		<div style={ {height: '100%'} }>
			<h2>Checklist</h2>
			<Table columnHeadings={columnHeadings} phases={checklist.phases}></Table>
		</div>
        
    );
};

export default Checklist;