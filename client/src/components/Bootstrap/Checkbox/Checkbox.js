import React, {useState, useEffect, useRef} from 'react';

/**
 * A Bootstrap styled checkbox
 * @param {name, checked, updateChecked}
 * @constructor
 */
const Checkbox = ( {name, checked, updateChecked} ) => {
    //state variables

    //useEffects(Lifecycle Methods)
    /**
     * ComponentDidMount: What should happen when this component is first loaded into the DOM
     */
    useEffect( () => {

    }, []);

    //Other Methods

    return (
        <input type="checkbox" name={name} aria-label={`Checkbox for ${name}`} for onChange={updateChecked}/>
    );
};

export default Checkbox;