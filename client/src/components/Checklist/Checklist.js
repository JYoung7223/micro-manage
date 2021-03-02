import React, {useState, useEffect, useRef} from 'react';
import Table from '../Bootstrap/Table/Table';
import { DateTime } from "luxon";

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

const checklist = {
	phases: [
	   {
		   title: 'Phase 1',
		   tasks: [
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.01',
				   template: '02.01',
				   line: 1,
				   instruction: 'Clean out the dog house'
			   },
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.02',
				   template: '02.02',
				   line: 2,
				   instruction: 'Setup sleeping area(pillow blankets, etc.'
			   },
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.02',
				   template: '02.02',
				   line: 2,
				   instruction: 'Sneak the bucket of ice cream out and hide it under your pillow'
			   }
		   ]
	   },
	   {
		   title: 'Phase 2',
		   tasks: [
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.01',
				   template: '02.01',
				   line: 3,
				   instruction: 'Setup rain cover in case it rains'
			   },
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.02',
				   template: '02.02',
				   line: 4,
				   instruction: 'Prepare dinner (there\'s dog food somewhere)'
			   }
		   ]
	   },
	   {
		   title: 'Phase 3',
		   tasks: [
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.01',
				   template: '02.01',
				   line: 5,
				   instruction: 'Go to sleep'
			   },
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.02',
				   template: '02.02',
				   line: 6,
				   instruction: 'Wake up'
			   },
			   {
				   finalReview: '',
				   finalReviewDate: '',
				   review: 'JY',
				   reviewDate: now,
				   prepared: 'WH',
				   preparedDate: now,
				   explanation: '01.02',
				   template: '02.02',
				   line: 6,
				   instruction: 'Bully Nate because you woke up on the wrong side of the lawn and it\'s his fault'
			   }
		   ]
	   },
	]
}

/**
 * Loads in the checklist corresponding to the id passed
 * @param {checklistId, ...props}
 * @constructor
 */
const Checklist = ( {checklistId, ...props} ) => {
    //state variables

    //useEffects(Lifecycle Methods)
    /**
     * ComponentDidMount: What should happen when this component is first loaded into the DOM
     */
    useEffect( () => {

    }, []);

    //Other Methods

    return (
		<div className='container'>
			<h2>Checklist</h2>
			<Table columnHeadings={columnHeadings} phases={checklist.phases}></Table>
		</div>
        
    );
};

export default Checklist;