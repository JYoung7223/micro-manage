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

const now = DateTime.now().toFormat('MM/dd');

const initialState = {
    modules: [
        ClientSideRowModelModule,
        MasterDetailModule,
        MenuModule,
        ColumnsToolPanelModule,
    ],
    columnDefs: [
        { field: 'title', headerName: 'Phases', cellRenderer: 'agGroupCellRenderer' },
        { field: 'order', headerName: 'Line', hide: true },
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
                    field: 'line',
                    headerName: 'Line #',
                    maxWidth: 100,
                    sortable: true,
                    rowDrag: true,
                    // headerClass: 'rotated-header',
                },
                {
                    field: 'instruction',
                    headerName: 'Instructions / Detail',
                    minWidth: 300,
                },
            ],
            onGridReady: params => {
                //Sort by order
                params.columnApi.applyColumnState({
                    state: [
                        {
                            colId: 'line',
                            sort: 'asc',
                        },
                    ],
                    defaultState: {sort: null},
                });
            },
            sortModel: [{field: 'line', sort: 'asc'}],
            defaultGroupSortComparator: (a,b) => a.line - b.line,
            defaultColDef: {
                flex: 1,
                editable: true,
                resizable: true,
            },
            headerHeight: 150,
            getRowNodeId: row => {
                return row._id;
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
                    line: 1,
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
                    line: 2,
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
                    line: 3,
                    instruction: 'Clean out the dog house'
                },
            ]
        },
    ],
};

const GridExample = props => {
    const [data, setData] = useState([]);
    const gridApi = useRef({});
    const gridColumnApi = useRef({});
    const sortActive = useRef(true);

    useEffect( () => {
        //Get the row data
        let rowData = initialState.rowData;

        //Add the phase id to each task, this will help me know which phase to modify when a
        //task is modified or a new task is added.
        rowData.forEach(phase => {
           phase.tasks.forEach(task => task.phaseId = phase._id)
        });

        //Update the state
        setData(rowData);
    }, []);

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
                        let phase = data.find(phase => phase._id === row.phaseId);

                        //Create the new task
                        let newTask = createNewTask(row.phaseId, row.line + 1);

                        newTask.phaseId = phase._id;
                        let tasksToAdd = [newTask];

                            //Get the tasks where their line #s need updated.
                        let tasksToUpdate = phase.tasks.filter(task => task.line > row.line);
                        tasksToUpdate.forEach(task => task.line++);

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
                                    colId: 'line',
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

    const createNewPhase = (order) => {
        let id = uuidv4();
        return {
            title: '<Hit enter to enter the title of this phase>',
            tasks: [createNewTask(id, 1)],
            order,
            _id: id,
        }
    };

    const getRowNodeId = (row) => {
        return row._id;
    };

    const createNewTask = (phaseId, line, title) => {
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
            line: line,
            phaseId: phaseId,
            _id: uuidv4(),
            instruction: title || '<Double click or hit enter to enter task instruction / details>',
        }
    };

    initialState.detailCellRendererParams.detailGridOptions.getContextMenuItems = getContextMenuItems;
    initialState.detailCellRendererParams.detailGridOptions.onRowDragMove = (event) => {
        let rowData = [];
        event.api.forEachNode(node => rowData.push(node));
        const movingNode = event.node;
        const overNode = event.overNode;
        const rowNeedsToMove = movingNode !== overNode;
        console.log('event on row drag move', event);
        if (rowNeedsToMove) {
            const movingData = movingNode.data;
            const overData = overNode.data;
            const fromIndex = rowData.indexOf(movingData);
            const toIndex = rowData.indexOf(overData);
            const newStore = rowData.slice();
            moveInArray(newStore, fromIndex, toIndex);
            setData(newStore);
            event.api.setRowData(newStore);
            event.api.clearFocusedCell();
        }
        function moveInArray(arr, fromIndex, toIndex) {
            const element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }
    };
    initialState.detailCellRendererParams.detailGridOptions.onSortChanged = () => {
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

    initialState.detailCellRendererParams.detailGridOptions.onCellValueChanged = (params) => {
        console.log("cell value changed", params);
        //If the line # changes we want to move the other line #'s around
        if(params.colDef.field === 'line')
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
                    if (sibling.line > oldVal && sibling.line <= newVal)
                        sibling.line--;
                });
            }
            else if(oldVal > newVal) {
                if(newVal < 1)
                    newVal = 1;
                siblings.forEach(sibling => {
                    if (sibling.line < oldVal && sibling.line >= newVal)
                        sibling.line++;
                });
            }

            //Update the row
            let row = params.node.data;
            row.line = newVal;
            siblings.push(row);

            params.api.applyTransaction({
                update: siblings
            });

            //Sort by order
            params.columnApi.applyColumnState({
                state: [
                    {
                        colId: 'line',
                        sort: 'asc',
                    },
                ],
                defaultState: {sort: null},
            });
        }
    };

    return (
        <div style={{ width: '100%', height: 'calc(100% - 50px)' }}>
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

export default GridExample

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