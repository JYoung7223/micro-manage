import React from 'react'



//TODO: Change reference so it also fixes the depth when it should change
/**
 * This method returns a new array with new row inserted and applicable rows re referenced
 * In order for this to work, each row needs to have a parentUuid, reference, and referenceNo attribute
 * @param rowToInsertAfter: The row that the inserted row goes afteer
 * @param rows: new array with row inserted and applicable rows re referenced
 * @return changedRows: Since the new row is passed in, this will only return the rows that change because of the row being inserted
 */
export const insertRowAndReRef = (rowToInsertAfter, rows, newRow) => {
    let changes = [];

    //Get all the rows that have the same parent as the row being added, that have a referenceNo equal to or greater than the referenceNo the new row will take
    let rowsToReref = rows.filter(el => (el.parentUuid === rowToInsertAfter.parentUuid && el.referenceNo > rowToInsertAfter.referenceNo));

    changes = changes.concat(reRefRowsAndSiblings(rowsToReref, rows, false));

    //Add the new row to the array, then sort it
    let index = rows.findIndex(row => row.uuid === rowToInsertAfter.uuid);

    if(newRow)
        rows.splice(index + 1, 0, newRow);

    console.log("rows after inserting");
    console.dir(rows);
    return changes;
};

/**
 * Indents a master file index row.
 * 1. Re-references all rows under the row being indented that have the same parent, also re references their descendants.
 * 2. Check if the row being indented will be indented inside the row above it or underneath it
 * 3. Get the current descendants of the row being indented set their ref to the new one
 *
 * @param row
 * @param rowAbove
 * @param rows
 * @returns {Array}
 */
export const indentRow = (row, rowAbove, rows) => {
    /**
     * Verify indenting the row is a legal move.
     * The row can only be indented if it's on the same level as the row above or on lower level (4 being lower than 5)
     */
    if(rowAbove.reference + '.1' === row.reference || row.reference.split('.').length > rowAbove.reference.split('.').length)
        return [];

    //Create an empty array to store the results in
    let changes = [];
    /**
     * 1. Set the reference for all the rows that were under it and their descendants
     * Set the row's parent to the row that was above it, set it's reference to the rows' reference above + '.1'
     * Set the parent of all its descendants to the same as the indented row, set the order # to the next one in the sequence
     */

        //If the row above me does not have the same parent as me, I need to set my parent to it's parent rather than it, and take the order # after it.

        //Set the reference for all the rows that were under it and their descendants
        //Get the rows that have the same parent as the row being indented and a reference # >

    let rowsUnder = rows.filter(el => (el.parentUuid === row.parentUuid && el.referenceNo > row.referenceNo));

    //Get my descendants by reference before re referencing anything
    let myDescendants = rows.filter(el => el.uuid !== row.uuid && el.reference.startsWith(row.reference));

    changes = changes.concat(reRefRowsAndSiblings(rowsUnder, rows, true));

    //Get the row's new reference
    let newRef = "";
    let newParent;
    let newDepth = 0;

    //If I am on the same level as the row above, indent me as a child underneath the row above
    if(rowAbove.parentUuid === row.parentUuid) {
        newParent = rowAbove.uuid;
        newRef = {reference: rowAbove.reference + '.01', referenceNo: 1};
        newDepth = rowAbove.depth + 1;
    }
    //Otherwise indent the row moving it one level higher (ex: 4 -> 5)
    else {
        //Count the # of periods in the row's reference
        let count = (row.reference.match(/\./g) || []).length;

        //Get the index of the rowAbove's reference at the period after the last period of the row's reference
        let refAboveIndexToEnd = rowAbove.reference.split('.', count + 2).join('.').length;

        //Get a substring of the row above's reference from the beginning to the index we got above
        let newSiblingAboveRef = rowAbove.reference.substring(0, refAboveIndexToEnd);

        //Get the new sibling above row
        let newSiblingAbove = rows.filter(el => el.reference === newSiblingAboveRef)[0];

        //Update the parent, new reference, and depth of the row
        newParent = newSiblingAbove.parentUuid;
        newRef = getNextRef(newSiblingAboveRef);
        newDepth = row.depth + 1;
    }

    //Update the ref of my descendants
    changes.concat(reRefDescendants(myDescendants, row.reference, newRef.reference));

    //Set row's new stuff
    row.parentUuid = newParent;
    row.reference = newRef.reference;
    row.referenceNo = newRef.referenceNo;
    row.depth = newDepth;

    changes.push(row);
    return changes;
};

/**
 *  This used to remove the row being changed and then insert it back into the array.
 *  (Since the children come with I wonder if i should just program this method to be specific to what it should be?)
 *
 * @param row
 * @param oldRef
 * @param newRef
 * @param rows
 * @returns {*}
 */
export const reRefOnManualReferenceChange = (row, oldRef, newRef, rows) => {
    //To have this function like you would expect, you would take the row and the children and reference only the rows between them
    let changes = [];

    //Get the new parent
    let newParentRef = newRef.substring(0, newRef.lastIndexOf('.'));
    let newParent = rows.filter(item => item.reference === newParentRef);

    //Get the new siblings, just in case there's not a new parent
    let newSibling = rows.filter(item => item.reference === newRef);

    if(newSibling.length < 1)
        newSibling = rows.filter(item => item.reference === getPrevRef(newRef).reference);

    if(newSibling.length < 1)
        newSibling = rows.filter(item => item.reference === getNextRef(newRef).reference);

    //TODO: Verify sibling above is not myself

    //Get the new parent id from the new parent if there is one, if not get it from the sibling
    let newParentId = newParent.length > 0 ? newParent[0].uuid : newSibling[0].parentUuid;

    //Get rows direct descendants, we are going to pass these in as a parameter to tell the methods not to mess with them
    let myDescendants = rows.filter(el => el.uuid !== row.uuid && el.reference.startsWith(oldRef));
    let rowsOffLimits = myDescendants.map(el => el.uuid);
    rowsOffLimits.push(row.uuid);

    /**
     * 2 scenarios can happen when moving a row:
     *  1. Move within same parent
     *  2. Move to a new parent
     *      a. If this is the case verify that the row is not moved inside itself
     *      b. Also verify that the new parent reference doesn't change throughout the process
     *
     * On both scenarios all you need to do is decrement siblings below row being moved along with descendants,
     * then increment the row at and rows below the new ref along with descendants
     */

    let rowsToReRef = [];
    //Check if I am moving inside the same parent
    if(newParentId === row.parentUuid)
    {
        //Get the sibling rows in between the old and new ref, re reference them along with their children
        if(oldRef < newRef) {
            rowsToReRef = rows.filter(item => item.uuid !== row.uuid && item.parentUuid === row.parentUuid && item.reference > oldRef && item.reference <= newRef);
            //The code below expects the rows to be sorted by reference ascending, so we need to sort the array before continuing
            rowsToReRef.sort(sortByReference);
        }
        else if(oldRef > newRef) {
            rowsToReRef = rows.filter(item => item.uuid !== row.uuid && item.parentUuid === row.parentUuid && item.reference < oldRef && item.reference >= newRef);
            //The code below expects the rows to be sorted by reference descending, so we need to sort the array then reverse before continuing
            rowsToReRef.sort(sortByReference);
            rowsToReRef.reverse();
        }

        //Reference the rows and their descendants
        rowsToReRef.forEach(item => {
            //Get the descendants of the row
            let itemDescendants = rows.filter(desc => desc.uuid !== item.uuid && desc.reference !== item.reference && desc.reference.startsWith(item.reference));

            let itemNewRef = "";
            //Check oldRef vs. newRef to see if the references are descreasing or increasing
            if(oldRef < newRef)
                itemNewRef = getPrevRef(item.reference);
            else if(oldRef > newRef)
                itemNewRef = getNextRef(item.reference);

            changes = changes.concat(reRefDescendants(itemDescendants, item.reference, itemNewRef.reference));

            item.reference = itemNewRef.reference;
            item.referenceNo = itemNewRef.referenceNo;

            changes.push(item);
        });

        //Set the reference for the row being changed, re reference it's desecendants pass the changes back.
        changes = changes.concat(reRefDescendants(myDescendants, oldRef, newRef));

        //Verify that the reference of the sibling above me hasn't changed
        let newSiblingAbove = rows.filter(item => item.reference === getPrevRef(newRef).reference);

        //If this happens, the reference of the new sibling that is supposed to be right above this row's new ref changed.
        //All we need to do is decrement newRef by 1
        if(newRef > oldRef && newSiblingAbove.length < 1)
            newRef = getPrevRef(newRef).reference;

        //Set the reference and parent
        row.reference = newRef;
        row.referenceNo = getReferenceNo(newRef);
        row.parentUuid = newParentId;

        changes.push(row);
        return changes;
    }
    else
    {
        //Verify new ref is not inside old ref, this would mean the row is placed inside itself
        if(newRef.startsWith(oldRef)) {
            throw Error("You cannot place something inside of itself");
            return [];
        }

        //Part 1 This removes the item which decrements the siblings below it and their descendants.

        //Get the siblings that need their reference decremented
        let siblingsBelow = rows.filter(item => item.parentUuid === row.parentUuid && item.referenceNo > row.referenceNo);

        siblingsBelow.sort(sortByReference);

        //re reference siblings and their descendants
        changes = changes.concat(removeRow(row, rows));
        // changes = changes.concat(reRefRowsAndSiblings(siblingsBelow, rows, true, [row.uuid]));


        //Part 2 Then inserts the row at the new ref, incrementing its new siblings at and below its new ref. Fixes descendants accordingly.

        //Insert the row, but if it moved to a higher LOD: 1.3 -> 1.4.6, it's parent reference possibly could have changed (If it moves to be under a sibling that was below it, its' parent reference changes, therefore its' new ref will need to change
        //Get the new parent row so we can verify the newParentRef still matches the new parent's ref
        let newParent = rows.filter(item => item.uuid === newParentId)[0];

        //If the newParent reference is not equal to the newParentRef, this means that the new parent's ref changed and my new ref needs to be updated to match
        if(newParent && newParent.reference !== newParentRef)
            newRef = newParent.reference + '.' + getReferenceNo(newRef);

        //Update the row(s) at and below the new reference along with their descendants
        let newSiblings = rows.filter(item => item.parentUuid === newParentId && item.referenceNo >= getReferenceNo(newRef));

        //The code expects the the array to be sorted by reference descending, so sort then reverse.
        newSiblings.sort(sortByReference).reverse();

        //Re-ref new siblings increasing their reference 1
        changes = changes.concat(reRefRowsAndSiblings(newSiblings, rows, false, rowsOffLimits));

        //Update the reference of the row's descendants
        changes = changes.concat(reRefDescendants(myDescendants, oldRef, newRef));

        //Update the row's reference
        row.reference = newRef;
        row.referenceNo = getReferenceNo(newRef);
        row.parentUuid = newParentId;
        row.depth = newSibling.depth;

        changes.push(row);
    }

    return changes;
};

export const deleteRow = (row, rows) => {
    return removeRow(row, rows);
};

/**
 * When a row is 'removed' it's siblings' references need to decrease along with their descendants
 *
 * @param row
 * @param rows
 */
const removeRow = (row, rows, changedUuids = []) => {
    let changes = [];
    //Get the siblings that need their reference decremented
    let siblingsBelow = rows.filter(item => item.parentUuid === row.parentUuid && item.referenceNo > row.referenceNo);

    siblingsBelow.sort(sortByReference);

    //re reference siblings and their descendants
    return reRefRowsAndSiblings(siblingsBelow, rows, true, [row.uuid]);
};

/**
 * When a row is inserted, set the parent correctly and reference the row currently sitting where this row is being inserted, it's siblings and all their descendants
 * @param row
 * @param rows
 */
const insertRow = (row, rows, changedUuids = []) => {
    let newArr = [];
    //Get the row above the row being moved

    //Check if there is already a row with this reference
    let currentRow = rows.filter(el => el.reference === row.reference && el.uuid !== row.uuid);

    if(currentRow.length > 0)
    {
        currentRow = currentRow[0];
        let currentRowNextRef = getNextRef(currentRow.reference);

        //Get the current row's siblings and re reference them along with their descendants
        let rowsToReref = rows.filter(el => el.parentUuid === currentRow.parentUuid && el.referenceNo > currentRow.referenceNo && !changedUuids.includes(el.uuid));

        //Re reference all the rows and their descendants
        rowsToReref.forEach(item => {
            let newRef = getNextRef(item.reference);
            //TODO: is causing a bug in the reference because it is grabbing rows that already got re referenced, to fix filter out the ones that have already been changed.
            //This makes so i dont have to create a recursive method that gets all the children then the children of those children, etc.
            let descendants = rows.filter(el => el.uuid !== item.uuid && el.reference.startsWith(item.reference) && !changedUuids.includes(el.uuid));

            //Replace the first part of the descendants old ref with the new one
            if(descendants.length > 0) {
                let reRefedRows = reRefDescendants(descendants, item.reference, newRef.reference);
                newArr = newArr.concat(reRefedRows);
                changedUuids = changedUuids.concat(reRefedRows.map(el => el.uuid));
            }

            item.reference = newRef.reference;
            item.referenceNo = newRef.referenceNo;
            changedUuids.push(item.uuid);
            newArr.push(item);
        });

        let currentDescendants = rows.filter(el => el.uuid !== currentRow.uuid && el.reference.startsWith(currentRow.reference)
            && !changedUuids.includes(el.uuid));

        if(currentDescendants.length > 0) {
            let reRefedRows = reRefDescendants(currentDescendants, currentRow.reference, currentRowNextRef.reference);
            newArr = newArr.concat(reRefedRows);
            changedUuids = changedUuids.concat(reRefedRows.map(el => el.uuid));
        }

        currentRow.reference = currentRowNextRef.reference;
        currentRow.referenceNo = currentRowNextRef.referenceNo;
        changedUuids.push(currentRow.uuid);

        row.parentUuid = currentRow.parentUuid;
        row.referenceNo = getReferenceNo(row.reference);
        changedUuids.push(row.uuid);
    }
    else
    {
        //Set parent and return the row
        let parentRef = getParentRef(row.reference);
        let parentRow = rows.filter(el => el.reference === parentRef);
        //get number of periods in rows ref to compare against the other rows to find siblings
        let refLevel = row.reference.split('.').length;
        let siblings = rows.filter(el => el.uuid !== row.uuid && el.parentUuid === parentRow.uuid);

        //Get siblings by parent and ref

        if(parentRow.length > 0)
            row.parentUuid = parentRow[0].uuid;
        else if(siblings.length > 0)
            row.parentUuid = siblings[0].parentUuid;

        row.referenceNo = getReferenceNo(row.reference);
        changedUuids.push(row.uuid);
        // newArr.push(row);
    }
    // rows.push(row);
    newArr.push(row);
    return newArr;
    // let rowAboveIndex = rows.findIndex(element => element.uuid === row.uuid) - 1;
    // let rowAbove = rows[rowAboveIndex];
    //
    // return newArr;
};

/**
 * Accepts array of rows that need their reference increased or decreased, array with all rows, and a boolean to decrease
 *
 * @param rowsToReRef
 * @param rows
 * @param decrease
 */
const reRefRowsAndSiblings = (rowsToReRef, rows, decrease, rowsOffLimits = []) => {
    let changes = [];
    //If I want to decrease the reference by 1
    if(decrease)
    {
        rowsToReRef.sort(sortByReference);
        //Loop over the rows, decrease their ref by 1 and update their descendants
        rowsToReRef.forEach(row => {
            let newRef = getPrevRef(row.reference);
            //Get the descendants
            let descendants = rows.filter(item => item.reference !== row.reference && item.reference.startsWith(row.reference) && !rowsOffLimits.includes(item.uuid));

            //Re reference the descendants and add them to the list of changes
            changes = changes.concat(reRefDescendants(descendants, row.reference, newRef.reference));

            //Set the new ref
            row.reference = newRef.reference;
            row.referenceNo = newRef.referenceNo;

            //Add row to list
            changes.push(row);
        });
    }
    else
    {
        rowsToReRef.sort(sortByReference);
        rowsToReRef.reverse();
        //Loop over the rows, increase their ref by 1 and update their descendants
        rowsToReRef.forEach(row => {
            let newRef = getNextRef(row.reference);
            //Get the descendants
            let descendants = rows.filter(item => item.reference !== row.reference && item.reference.startsWith(row.reference) && !rowsOffLimits.includes(item.uuid));

            //Re reference the descendants and add them to the list of changes
            changes = changes.concat(reRefDescendants(descendants, row.reference, newRef.reference));

            //Set the new ref
            row.reference = newRef.reference;
            row.referenceNo = newRef.referenceNo;

            //Add row to list
            changes.push(row);
        });
    }
    return changes;
};

const reRefDescendants = (descendants, oldRef, newRef) => {
    descendants.forEach(descendant => {
        descendant.reference = descendant.reference.replace(oldRef, newRef);
    });
    return descendants;
};

/**
 * Takes in an oldRef (ex: 1.2) and returns a newRef one before the oldRef (ex: 1.1)
 * @param oldRef
 * @returns {string|number|string}
 */
export const getPrevRef = (ref) => {
    let first = '', last = '';
    if(!ref.includes("."))
    {
        last = Number(ref) -1;
        if(last < 10)
            last = '0' + last;
        return {
            reference: last,
            referenceNo: (Number(ref) - 1)
        };
    }
    else
    {
        first = ref.substring(0, ref.lastIndexOf('.'));
        last = Number(ref.substring(ref.lastIndexOf('.') + 1, ref.length)) - 1;
        if(last < 10)
            last = '0' + last;
        return {
            reference: first + "." + last,
            referenceNo: last
        };
    }
};

/**
 * Takes in an oldRef (ex: 01.01) and returns a newRef one after the oldRef (ex: 01.02)
 * @param oldRef
 * @returns {{referenceNo: number}}
 */
export const getNextRef = (oldRef) => {
    let first = '', last = '';
    if(!oldRef.includes("."))
    {
        if(oldRef < 9)
            oldRef = '0' + (Number(oldRef) + 1);
        else
            oldRef = Number(oldRef) + 1;
        return {
            reference: oldRef,
            referenceNo: oldRef
        }
    }
    else
    {
        first = oldRef.substring(0, oldRef.lastIndexOf('.'));
        last = Number(oldRef.substring(oldRef.lastIndexOf('.') + 1, oldRef.length)) + 1;
        if(last < 10)
            last = '0' + last;
        return {
            reference: first + "." + last,
            referenceNo: last
        };
    }
};

/**
 * Takes in an oldRef (ex: 1.1) and returns a newRef one after the oldRef (ex: 1.2)
 * @param oldRef
 * @returns {{referenceNo: string}}
 */
export const getReferenceNo = (ref) => {
    return ref.substring(ref.lastIndexOf('.') + 1, ref.length);
};

export const getParentRef = (ref) => {
    return ref.substring(0, ref.lastIndexOf('.'));
};

/**
 * This function moves a master file index row to a new place on the mfi, re referencing
 * anything that needs re referenced
 *
 * @param rows
 * @param row
 * @param newRef
 * @param newParent
 */
export const moveRow = (rows, row, newRef, newParent) => {
    //Check if the row is being moved within the same parent
    if(newParent)
    {
        /**
         * This means we need to re reference everything under it and any rows under the
         * new parent that have a referenceNo >= to
         */
        let newOrderNo = newRef.substring(newRef.lastIndexOf('.') + 1, newRef.length);

        //Get items currently under the row being moved and decrease their order #
        let items = rows.map(item => item.parentUuid === row.parentUuid &&
            item.referenceNo > row.referenceNo);
        items.forEach(item => {
            let myRef = getPrevRef(item.reference);
            item.reference = myRef.reference;
            item.referenceNo = myRef.referenceNo;
        });

        //Get items that will be underneath this item after it's moved
        items = rows.map(item => item.parentUuid = newParent && item.referenceNo >= newOrderNo);
        items.forEach(item => {
            let myRef = getNextRef(item.reference);
            item.reference = myRef.reference;
            item.referenceNo = myRef.referenceNo;
        });
        row.reference = newRef;
        row.referenceNo = newOrderNo;
    }
    else
    {
        let newOrderNo = newRef.substring(newRef.lastIndexOf('.') + 1, newRef.length);
        if(row.referenceNo > newOrderNo)
        {
            //row is being moved up
            //Re reference the rows with the same parent that have a referenceNo < oldOrderNo >= newOrderNo
            let reRefRows = rows.map(item => item.parentUuid === row.parentUuid &&
                item.referenceNo < row.referenceNo &&
                item.referenceNo >= newOrderNo);
            //Increase the order # by 1
            reRefRows.forEach(reRefRow => {
                let myNewRef = getNextRef(reRefRow.reference);
                reRefRow.reference = myNewRef.reference;
                reRefRow.referenceNo = myNewRef.referenceNo;
            });

            //Set the moved rows new Reference
            row.reference = newRef;
            row.referenceNo = newOrderNo;
        }
        else
        {
            //row is being moved down
            //Re reference the rows with the same parent that have a referenceNo < oldOrderNo >= newOrderNo
            let reRefRows = rows.map(item => item.parentUuid === row.parentUuid &&
                item.referenceNo > row.referenceNo &&
                item.referenceNo <= newOrderNo);
            //Decrease the order # by 1
            reRefRows.forEach(reRefRow => {
                let myNewRef = getPrevRef(reRefRow.reference);
                reRefRow.reference = myNewRef.reference;
                reRefRow.referenceNo = myNewRef.referenceNo;
            });

            //Set the moved rows new Reference
            row.reference = newRef;
            row.referenceNo = newOrderNo;
        }
    }
    rows.sort(sortByReference);
    return rows;

};

const decreaseOrderNo = (rows) => {
    rows.forEach(row => {
        let myNewRef = getPrevRef(row.reference);
        row.reference = myNewRef.reference;
        row.referenceNo = myNewRef.referenceNo;
    });
};

const increaseOrderNo = (rows) => {
    rows.forEach(row => {
        let myNewRef = getNextRef(row.reference);
        row.reference = myNewRef.reference;
        row.referenceNo = myNewRef.referenceNo;
    });
};

export const sortByReference = (a, b) => {
    if(a.reference < b.reference)
        return -1;
    else if(a.reference > b.reference)
        return 1;
    else
        return 0;
};


// export default Referencing;
