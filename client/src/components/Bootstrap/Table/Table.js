import React, {useState, useEffect, useRef} from 'react';
import Checkbox from '../Checkbox/Checkbox';

/**
 * A Bootstrap styled table
 * @param {columnHeadings, data}
 * @constructor
 */
const Table = ( {columnHeadings = [], phases = []} ) => {
    //state variables

    //useEffects(Lifecycle Methods)
    /**
     * ComponentDidMount: What should happen when this component is first loaded into the DOM
     */
    useEffect( () => {
		console.log('headings', columnHeadings);
		console.log("phases", phases);
    }, []);

	//Other Methods
	const updateChecked = (e) => {
		console.log('event', e);
		console.log('current target', e.currentTarget);
	};

    return (
		<table className='table table-striped table-dark table-hover table-bordered'>
			<thead>
				<tr>
					{columnHeadings.map( head => <td scope="col" style={head.style ? head.style : {}}>{head.label}</td>)}
				</tr>
			</thead>
			<tbody>
				{
					phases.map(phase => (
						<>
							<tr>
								<td colSpan={columnHeadings.length}><p className='h4'>{phase.title}</p></td>
							</tr>
							{
								phase.tasks.map(row => 
									(
										<tr scope={'row'}>
											{columnHeadings.map( head => {
												let td = '';
												if(typeof row[head.value] === 'boolean')
													td = <Checkbox name={head.value} checked={row[head.value]} updateChecked={updateChecked}></Checkbox>
												else
													td = row[head.value]
				
												return <td scope='col'>{td}</td>
											})}
										</tr>
									)
									
								)
							}
						</>
					))
				}
			</tbody>
		</table>
    );
};

export default Table;