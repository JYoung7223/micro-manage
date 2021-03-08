import React from 'react';
import './Introduction.scss';

/**
 * Talk about what this app allows you to do
 */
const Introduction = (props) => {

    return (
        <div id="intro-container" className="container-fluid" style={ {backgroundColor: '#343a40', height: '100%', display: 'flex'} }>
            <div className={'row'}>
                <div id="homepage-text" className={'col align-self-center col-md-8'} style={ {marginLeft: '100px'} }>
                    <h1 className={'display-1 text-white text-center align-self-center'}>
                        Micro Manage
                    </h1>
                    <ul>
                        <li className={'text-white h3'}>
                            Easily document your processes in checklist templates
                        </li>
                        <li className={'text-white h3'}>
                            You can create a copy of a checklist template to begin going through it.
                        </li>
                        <li className={'text-white h3'}>
                            Create, update and delete checklist templates
                        </li>
                        <li className={'text-white h3'}>
                            Shows checklist statistics, how many times the template has been copied, the number of copies that are in progress, ready for review, final review, complete, etc.
                        </li>
                        <li className={'text-white h3'}>
                            Click here to <a id="checklist-management" href='/checklist-management'>manage your checklists</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Introduction;