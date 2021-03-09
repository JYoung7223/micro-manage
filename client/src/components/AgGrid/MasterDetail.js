'use strict';

import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import './AgGrid.scss';
import DateTime from "luxon/src/datetime";
import { v4 as uuidv4 } from 'uuid';
import API from '../../utils/API'

const now = DateTime.now().toFormat('MM/dd');

const initialState = {
    modules: [
        ClientSideRowModelModule,
        MasterDetailModule,
        MenuModule,
        ColumnsToolPanelModule,
    ],
    columnDefs: [
        { field: 'title', headerName: 'Phases', cellRenderer: 'agGroupCellRenderer', rowDrag: true, },
        { field: 'lineNumber', headerName: 'Line', hide: true },
    ],
    defaultColDef: {
        flex: 1,
        editable: true,
    },
    popupParent: document.querySelector('body'),
    detailCellRendererParams: {
        detailGridOptions: {
            columnDefs: [
                {
                    field: 'finalReviewedBy',
                    headerName: 'Final Review',
                    headerClass: 'rotated-header',
                    maxWidth: 100,
                    // cellClass: 'initial-cell',
                    // minWidth: 100,
                    // maxHeight: 100,
                },
                {
                    field: 'finalReviewDate',
                    headerName: 'Final Reviewed Date',
                    headerClass: 'rotated-header',
                    maxWidth: 100,
                    valueFormatter: (params) => {

                        let val = params.value;
                        if(val) {
                            val = DateTime.fromISO(val).toFormat('MM/dd');
                            if(val === 'Invalid DateTime')
                                val = DateTime.fromJSDate(new Date(params.value)).toFormat('MM/dd');

                            console.log(val);
                            return val;
                        }
                        return '';
                    },
                    // headerClass: 'rotated-text'
                },
                {
                    field: 'reviewedBy',
                    headerName: 'Review',
                    headerClass: 'rotated-header',
                    maxWidth: 100,
                    // cellClass: 'initial-cell',
                    // minWidth: 100
                    // maxWidth: 50,
                },
                {
                    field: 'reviewDate',
                    headerName: 'Reviewed Date',
                    headerClass: 'rotated-header',
                    maxWidth: 100,
                    valueFormatter: (params) => {

                        let val = params.value;
                        if(val) {
                            val = DateTime.fromISO(val).toFormat('MM/dd');
                            if(val === 'Invalid DateTime')
                                val = DateTime.fromJSDate(new Date(params.value)).toFormat('MM/dd');

                            console.log(val);
                            return val;
                        }
                        return '';
                    },
                },
                {
                    field: 'preparedBy',
                    headerName: 'Prepare',
                    headerClass: 'rotated-header',
                    maxWidth: 100,
                    // cellClass: 'initial-cell',
                    // minWidth: 100,
                    // maxWidth: 50,
                },
                {
                    field: 'preparedDate',
                    headerName: 'Prepared Date',
                    headerClass: 'rotated-header',
                    maxWidth: 100,
                    valueFormatter: (params) => {

                        let val = params.value;
                        if(val) {
                            val = DateTime.fromISO(val).toFormat('MM/dd');
                            if(val === 'Invalid DateTime')
                                val = DateTime.fromJSDate(new Date(params.value)).toFormat('MM/dd');

                            console.log(val);
                            return val;
                        }
                        return '';
                    },
                    // cellEditor: 'datePicker',
                    // cellClass: 'initial-cell',
                    // minWidth: 100,
                },
                {
                    field: 'explanation',
                    headerName: 'Explanation',
                    headerClass: 'rotated-header',
                    maxWidth: 200,
                    cellRenderer: function(params) {
                        if(params.value.includes('http'))
                            return '<a href="' + params.value + '" target="_blank">'+ params.value +'</a>';
                        else
                            return params.value;
                    },
                },
                {
                    field: 'template',
                    headerName: 'Source',
                    headerClass: 'rotated-header',
                    maxWidth: 200,
                    cellRenderer: function(params) {
                        if(params.value.includes('http'))
                            return '<a href="' + params.value + '" target="_blank">'+ params.value +'</a>';
                        else
                            return params.value;
                    },
                },
                // {
                //     field: 'mfiRef',
                //     headerName: 'MFI #',
                //     maxWidth: 200,
                //     // headerClass: 'rotated-header',
                // },
                {
                    field: 'lineNumber',
                    headerName: 'Line #',
                    maxWidth: 150,
                    sortable: true,
                    // headerClass: 'rotated-header',
                },
                {
                    field: 'instruction',
                    headerName: 'Instructions / Detail',
                    minWidth: 300,
                    rowDrag: true,
                },
            ],
            onGridReady: params => {
                //Sort by order
                params.columnApi.applyColumnState({
                    state: [
                        {
                            colId: 'lineNumber',
                            sort: 'asc',
                        },
                    ],
                    defaultState: {sort: null},
                });
            },
            sortModel: [{field: 'lineNumber', sort: 'asc'}],
            defaultGroupSortComparator: (a,b) => a.lineNumber - b.lineNumber,
            defaultColDef: {
                flex: 1,
                editable: true,
                resizable: true,
            },
            headerHeight: 150,
            getRowNodeId: row => {
                return row.lineNumber;
            },
            getContextMenuItems: (params) => { },
            onCellValueChanged: (params) => { },
            stopEditingWhenGridLosesFocus: true,
            // rowDragManaged:true,
            animateRows: true,
            // components: { datePicker: getDatePicker() },
        },
        getDetailRowData: function (params) {
            params.successCallback(params.data.tasks);
        },
    },
};

const MasterDetailGrid = ( {checklist: _checklist} ) => {
    const [checklist, setChecklist] = useState([]);
    const [data, setData] = useState([]);
    const gridApi = useRef({});
    const gridColumnApi = useRef({});
    const sortActive = useRef(true);

    useEffect( () => {
        let rowData = [];
        //Get the row data
        if(_checklist && _checklist.phases) {
            // let rowData = checklist;

            if(_checklist.phases.length < 1)
                _checklist.phases.push(createNewPhase(1));

            //Add the phase id to each task, this will help me know which phase to modify when a
            //task is modified or a new task is added.
            _checklist.phases.forEach(phase => {
                phase.tasks.forEach(task => task.phaseId = phase.lineNumber);
                phase.tasks.sort(sortByLineNumber);
                rowData.push(phase);
            });
        }
        else
        {
            //If there are no phases add one phase row with one task attached
            let newPhase = createNewPhase(1);
            rowData = [newPhase];
            _checklist.phases = rowData;
        }

        _checklist.phases.sort(sortByLineNumber);
        //Update the state
        setData(rowData);
        setChecklist(_checklist);
    }, [_checklist]);

    const onGridReady = (params) => {
        gridApi.current = params.api;
        params.columnApi.applyColumnState({
            state: [
                {
                    colId: 'order',
                    sort: 'asc',
                },
            ],
            defaultState: {sort: null},
        });
        gridColumnApi.current = params.columnApi;
    };

    const getContextMenuItems = (params) => {
        const result = [
            {
                name: 'Insert',
                action: function () {
                    //I'm going to program this assuming that there is a phase_id in each task.
                    let row = params.node.data;
                    let rows = [];
                    params.api.forEachNode( (node) => rows.push(node.data));

                    console.log("phases", rows);

                    //Find where the row should be inserted, first checking whether we are inserting a phase or task
                    //If there are tasks that means we are inserting a new phase
                    if(row.tasks)
                    {
                        let phasesToAdd = [createNewPhase(row.lineNumber + 1)];
                        let phasesToUpdate = rows.filter(phase => phase.lineNumber > row.lineNumber);
                        phasesToUpdate.forEach(phase => phase.lineNumber++);

                        // data.push(phasesToAdd[0]);
                        rows = rows.concat(phasesToAdd).sort(sortByLineNumber);
                        setData(rows);

                        params.api.setRowData(rows);

                        // updateGridAndSort(params, {add: phasesToAdd, update: phasesToUpdate} );
                    }
                    //Otherwise we are inserting a new task
                    else
                    {
                        //Create the new task
                        let newTask = createNewTask(row.phaseId, row.lineNumber + 1);

                        newTask.phaseId = row.phaseId;
                        let tasksToAdd = [newTask];

                        //Get the tasks where their line #s need updated.
                        let tasksToUpdate = rows.filter(task => task.lineNumber > row.lineNumber);
                        tasksToUpdate.forEach(task => task.lineNumber++);

                        // phase.tasks.push(tasksToAdd[0]);
                        rows = rows.concat(tasksToAdd).sort(sortByLineNumber);

                        //Set the phases tasks
                        let phase = data.find(ph => ph.lineNumber === row.phaseId);
                        phase.tasks = rows;

                        params.api.setRowData(rows);
                        // updateGridAndSort(params, {add: tasksToAdd, update: tasksToUpdate} );
                    }

                },
                cssClasses: ['redFont', 'bold'],
            },
            {
                name: 'Delete',
                action: function () {
                    //I'm going to program this assuming that there is a phase_id in each task.
                    let row = params.node.data;
                    let rows = [];
                    params.api.forEachNode( (node) => rows.push(node.data));

                    console.log("phases", rows);

                    //Find where the row should be inserted, first checking whether we are inserting a phase or task
                    //If there are tasks that means we are inserting a new phase
                    if(row.tasks)
                    {
                        //Re-reference phases
                        let phasesToUpdate = data.filter(phase => phase.lineNumber > row.lineNumber);
                        data.splice(row.lineNumber - 1, 1);

                        phasesToUpdate.forEach(phase => phase.lineNumber--);

                        setData(data);

                        params.api.setRowData(data);
                    }
                    //Otherwise we are inserting a new task
                    else
                    {
                        //Update the data
                        //Get the phase
                        let phase = data.find(phase => phase.lineNumber === row.phaseId);

                        //Remove task from tasks
                        phase.tasks.splice(row.lineNumber - 1, 1);

                        let tasksToUpdate = rows.filter(task => task.lineNumber > row.lineNumber);
                        //Decrement the lines that need decremented
                        tasksToUpdate.forEach(task => task.lineNumber--);

                        setData(data);
                        console.log('data', data);

                        params.api.setRowData(phase.tasks);

                        // updateGridAndSort(params, {update: tasksToUpdate, remove: [row]} );
                    }

                },
                cssClasses: ['redFont', 'bold'],
            },
        ];
        return result;
    };

    const sortByLineNumber = (a,b) => a.lineNumber - b.lineNumber;

    const updateGridAndSort = (params, {add = [], remove = [], update = []}) => {
        //Update the grid
        params.api.applyTransaction({
            remove,
            update,
            add,
        });

        //Sort by line #
        params.columnApi.applyColumnState({
            state: [
                {
                    colId: 'lineNumber',
                    sort: 'asc',
                },
            ],
            defaultState: {sort: null},
        });
    };

    const createNewPhase = (lineNumber) => {
        return {
            title: '<Hit enter to enter the title of this phase>',
            tasks: [createNewTask(lineNumber, 1)],
            lineNumber,
        }
    };

    const getRowNodeId = (row) => {
        return row.lineNumber;
    };

    const createNewTask = (phaseId, lineNumber, title) => {
        let dt = DateTime.now().toFormat('MM/dd');
        return {
            finalReviewedBy: '',
            finalReviewedDate: '',
            reviewedBy: '',
            reviewedDate: '',
            preparedBy: '',
            preparedDate: '',
            explanation: '',
            template: '',
            mfi: '',
            lineNumber: lineNumber,
            phaseId: phaseId,
            instruction: title || '<Double click or hit enter to enter task instruction / details>',
        }
    };

    const onRowDragMove = (event) => {
        let rowData = [];
        event.api.forEachNode(node => rowData.push(node));
        rowData = rowData.map(node => node.data);
        const movingNode = event.node;
        const overNode = event.overNode;
        const rowNeedsToMove = movingNode !== overNode;
        if (rowNeedsToMove && overNode) {
            const movingData = movingNode.data;
            const overData = overNode.data;
            const fromIndex = rowData.findIndex(row => row.lineNumber === movingData.lineNumber);
            const toIndex = rowData.findIndex(row => row.lineNumber === overData.lineNumber);
            const newStore = rowData.slice();
            moveInArray(newStore, fromIndex, toIndex);
            newStore.forEach( (row, index) => {
                row.lineNumber = index + 1;
                if(row.tasks)
                    row.tasks.forEach(task => task.phaseId = row.lineNumber);
            });
            // event.api.applyTransaction(newStore);
            event.api.setRowData(newStore);
            event.api.clearFocusedCell();
        }
        function moveInArray(arr, fromIndex, toIndex) {
            const element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }
    };

    const onSortChanged = () => {
        const sortModel = gridApi.current.getSortModel();
        sortActive.current = sortModel && sortModel.length > 0;
        const suppressRowDrag = sortActive;
        console.log(
            'sortActive = ' +
            sortActive +
            ', allowRowDrag = ' +
            suppressRowDrag
        );
        gridApi.current.setSuppressRowDrag(suppressRowDrag);
    };

    const onCellValueChanged = (params) => {
        //If the line # changes we want to move the other line #'s around
        if(params.colDef.field === 'lineNumber')
        {
            let newVal = params.value;
            let oldVal = params.oldValue;
            let siblings = [];
            params.api.forEachNode( (node) => siblings.push(node.data));

            //If the newVal > oldVal get the nodes with line # > oldVal and <= newVal, decrement line #'s
            if(newVal > oldVal) {
                if(newVal > siblings.length)
                    newVal = siblings.length;

                siblings.forEach(sibling => {
                    if (sibling.lineNumber > oldVal && sibling.lineNumber <= newVal)
                        sibling.lineNumber--;
                });
            }
            else if(oldVal > newVal) {
                if(newVal < 1)
                    newVal = 1;
                siblings.forEach(sibling => {
                    if (sibling.lineNumber < oldVal && sibling.lineNumber >= newVal)
                        sibling.lineNumber++;
                });
            }

            //Update the row
            let row = params.node.data;
            row.lineNumber = newVal;
            siblings.push(row);

            // params.api.setRowData(siblings);

            params.api.applyTransaction({
                update: siblings
            });

            //Sort by order
            params.columnApi.applyColumnState({
                state: [
                    {
                        colId: 'lineNumber',
                        sort: 'asc',
                    },
                ],
                defaultState: {sort: null},
            });
        }
    };

    initialState.detailCellRendererParams.detailGridOptions.getContextMenuItems = getContextMenuItems;
    initialState.detailCellRendererParams.detailGridOptions.onRowDragMove = onRowDragMove;
    initialState.detailCellRendererParams.detailGridOptions.onSortChanged = onSortChanged;
    initialState.detailCellRendererParams.detailGridOptions.onCellValueChanged = onCellValueChanged;

    const saveClicked = () => {
        //Get the phases from the grid
        //Get the checklist data, check the rowData and see if it has the updates
        let phases = [];
        gridApi.current.forEachNode(node => phases.push(node.data));
        checklist.phases = phases;

        //Call api to submit the checklist data
        API.updateChecklist(checklist._id, checklist);
    };

    return (
        <div style={{ width: '100%', height: 'calc(100% - 50px)', textAlign: 'end' }}>
            <a
                href={'/checklist-management'}
                className="btn btn-info"
                style={ {marginBottom: '5px', marginRight: '5px'} }
            >
                Back to checklists
            </a>
            <button
                className="btn btn-primary"
                style={ {marginBottom: '5px'} }
                onClick={saveClicked}
            >
                Save
            </button>
            <div
                id="myGrid"
                style={{
                    width: '100%',
                }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    modules={initialState.modules}
                    columnDefs={initialState.columnDefs}
                    defaultColDef={initialState.defaultColDef}
                    masterDetail={true}
                    stopEditingWhenGridLosesFocus={true}
                    onRowDragMove={onRowDragMove}
                    onSortChanged={onSortChanged}
                    detailRowAutoHeight={true}
                    // onCellValueChanged={onCellValueChanged}
                    // rowDragManaged={true}
                    // defaultSortColumn={'order'}
                    sortModel={[{field: 'order', sort: 'asc'}]}
                    getRowNodeId={getRowNodeId}
                    popupParent={initialState.popupParent}
                    detailCellRendererParams={initialState.detailCellRendererParams}
                    getContextMenuItems={getContextMenuItems}
                    onGridReady={onGridReady}
                    // onFirstDataRendered={onFirstDataRendered.bind(this)}
                    rowData={data}
                />
            </div>
        </div>
    );
};

export default MasterDetailGrid;