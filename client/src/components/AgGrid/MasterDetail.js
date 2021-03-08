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
                    field: 'finalReview',
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
                    // headerClass: 'rotated-text'
                },
                {
                    field: 'review',
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
                },
                {
                    field: 'prepared',
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
                    // cellEditor: 'datePicker',
                    // cellClass: 'initial-cell',
                    // minWidth: 100,
                },
                {
                    field: 'explanationRef',
                    headerName: 'Explanation Ref',
                    headerClass: 'rotated-header',
                    maxWidth: 200,
                },
                {
                    field: 'templateRef',
                    headerName: 'Template Ref',
                    headerClass: 'rotated-header',
                    maxWidth: 200,
                },
                {
                    field: 'mfiRef',
                    headerName: 'MFI #',
                    maxWidth: 200,
                    // headerClass: 'rotated-header',
                },
                {
                    field: 'lineNumber',
                    headerName: 'Line #',
                    maxWidth: 100,
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
    rowData: [
        {
            _id: 0,
            title: 'Phase 1',
            order: 1,
            tasks: [
                {
                    _id: 1,
                    finalReview: 'WH',
                    finalReviewDate: now,
                    review: 'JY',
                    reviewDate: now,
                    prepared: 'WH',
                    preparedDate: now,
                    explanationRef: '01.01',
                    templateRef: '02.01',
                    mfiRef: '01',
                    lineNumber: 1,
                    instruction: 'Clean out the dog house',
                },
                {
                    _id: 2,
                    finalReview: '',
                    finalReviewDate: '',
                    review: 'JY',
                    reviewDate: now,
                    prepared: 'WH',
                    preparedDate: now,
                    explanationRef: '01.01',
                    templateRef: '02.01',
                    mfiRef: '02',
                    lineNumber: 2,
                    instruction: 'Clean out the dog house'
                },
                {
                    _id: 3,
                    finalReview: '',
                    finalReviewDate: '',
                    review: 'JY',
                    reviewDate: now,
                    prepared: 'WH',
                    preparedDate: now,
                    explanationRef: '01.01',
                    templateRef: '02.01',
                    mfiRef: '03',
                    lineNumber: 3,
                    instruction: 'Clean out the dog house'
                },
            ]
        },
    ],
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

            //Add the phase id to each task, this will help me know which phase to modify when a
            //task is modified or a new task is added.
            _checklist.phases.forEach(phase => {
                phase.tasks.forEach(task => task.phaseId = phase.lineNumber);
                rowData.push(phase);
            });
        }

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
                        let phasesToAdd = [createNewPhase(row.order + 1)];
                        let phasesToUpdate = rows.filter(phase => phase.order > row.order);
                        phasesToUpdate.forEach(phase => phase.order++);

                        setData(rows.concat(phasesToAdd));

                        params.api.applyTransaction({
                            add: phasesToAdd,
                            update: phasesToUpdate
                        });

                        //Sort by order
                        params.columnApi.applyColumnState({
                            state: [
                                {
                                    colId: 'order',
                                    sort: 'asc',
                                },
                            ],
                            defaultState: {sort: null},
                        });
                    }
                    //Otherwise we are inserting a new task
                    else
                    {
                        //Get the phase that the selected task is apart of
                        let phase = data.find(phase => phase.lineNumber === row.phaseId);

                        //Create the new task
                        let newTask = createNewTask(row.phaseId, row.lineNumber + 1);

                        newTask.phaseId = phase.lineNumber;
                        let tasksToAdd = [newTask];

                            //Get the tasks where their line #s need updated.
                        let tasksToUpdate = phase.tasks.filter(task => task.lineNumber > row.lineNumber);
                        tasksToUpdate.forEach(task => task.lineNumber++);

                        phase.tasks = phase.tasks.concat(tasksToAdd);

                        //Update the grid
                        params.api.applyTransaction({
                            add: tasksToAdd,
                            update: tasksToUpdate,
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
                    }

                },
                cssClasses: ['redFont', 'bold'],
            },
        ];
        return result;
    };

    const createNewPhase = (lineNumber) => {
        let id = uuidv4();
        return {
            title: '<Hit enter to enter the title of this phase>',
            tasks: [createNewTask(id, 1)],
            lineNumber,
        }
    };

    const getRowNodeId = (row) => {
        return row.lineNumber;
    };

    const createNewTask = (phaseId, lineNumber, title) => {
        let dt = DateTime.now().toFormat('MM/dd');
        return {
            finalReview: '',
            finalReviewDate: '',
            review: '',
            reviewDate: '',
            prepared: '',
            preparedDate: '',
            explanationRef: '',
            templateRef: '',
            mfiRef: '',
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
        if (rowNeedsToMove) {
            const movingData = movingNode.data;
            const overData = overNode.data;
            const fromIndex = rowData.findIndex(row => row.lineNumber === movingData.lineNumber);
            const toIndex = rowData.findIndex(row => row.lineNumber === overData.lineNumber);
            const newStore = rowData.slice();
            moveInArray(newStore, fromIndex, toIndex);
            newStore.forEach( (row, index) => {
                if(row.lineNumber)
                    row.lineNumber = index + 1;
                else if(row.lineNumber)
                    row.lineNumber = index + 1;
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

    initialState.detailCellRendererParams.detailGridOptions.getContextMenuItems = getContextMenuItems;
    initialState.detailCellRendererParams.detailGridOptions.onRowDragMove = onRowDragMove;
    initialState.detailCellRendererParams.detailGridOptions.onSortChanged = onSortChanged;

    initialState.detailCellRendererParams.detailGridOptions.onCellValueChanged = (params) => {
        console.log("cell value changed", params);
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

    const saveClicked = () => {
        //Get the checklist data, check the rowData and see if it has the updates
        let phases = data;
        checklist.phases = phases;

        //Call api tto submit the checklist data
        API.saveChecklist(checklist);
    };

    return (
        <div style={{ width: '100%', height: 'calc(100% - 50px)', textAlign: 'end' }}>
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
                    height: '100%',
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

export default MasterDetailGrid

// function getDatePicker() {
//     function Datepicker() {}
//     Datepicker.prototype.init = function (params) {
//         this.eInput = document.createElement('input');
//         this.eInput.value = params.value;
//         this.eInput.classList.add('ag-input');
//         this.eInput.style.height = '100%';
//         $(this.eInput).datepicker({ dateFormat: 'dd/mm/yy' });
//     };
//     Datepicker.prototype.getGui = function () {
//         return this.eInput;
//     };
//     Datepicker.prototype.afterGuiAttached = function () {
//         this.eInput.focus();
//         this.eInput.select();
//     };
//     Datepicker.prototype.getValue = function () {
//         return this.eInput.value;
//     };
//     Datepicker.prototype.destroy = function () {};
//     Datepicker.prototype.isPopup = function () {
//         return false;
//     };
//     return Datepicker;
// }