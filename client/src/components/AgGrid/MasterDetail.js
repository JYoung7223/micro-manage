'use strict';

import React, { useState, useRef } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import './AgGrid.scss';
import DateTime from "luxon/src/datetime";

const now = DateTime.now().toFormat('MM/dd');

const initialState = {
    modules: [
        ClientSideRowModelModule,
        MasterDetailModule,
        MenuModule,
        ColumnsToolPanelModule,
    ],
    columnDefs: [
        { field: 'title', headerName: 'Phase', cellRenderer: 'agGroupCellRenderer' },
    ],
    defaultColDef: {
        flex: 1,
        editable: true,
    },
    detailCellRendererParams: {
        detailGridOptions: {
            columnDefs: [
                {
                    field: 'finalReview',
                    headerName: 'Final Review',
                    headerClass: 'rotated-text no-padding initial-header',
                    cellClass: 'initial-cell',
                    maxWidth: 50,
                    // maxHeight: 100,
                },
                { field: 'finalReviewDate', headerName: 'Final Reviewed Date', headerClass: 'rotated-text' },
                {
                    field: 'review',
                    headerName: 'Review',
                    headerClass: 'rotated-text',
                    cellClass: 'initial-cell',
                    maxWidth: 50,
                },
                { field: 'reviewDate', headerName: 'Reviewed Date', headerClass: 'rotated-text' },
                {
                    field: 'prepared',
                    headerName: 'Prepare',
                    headerClass: 'rotated-text',
                    cellClass: 'initial-cell',
                    maxWidth: 50,
                },
                { field: 'preparedDate', headerName: 'Prepared Date', headerClass: 'rotated-text' },
                { field: 'explanationRef', headerName: 'Explanation Ref' },
                { field: 'templateRef', headerName: 'Template Ref' },
                { field: 'mfiRef', headerName: 'MFI #' },
                { field: 'line', headerName: 'Line #' },
                { field: 'instruction', headerName: 'Instruction' },
            ],
            defaultColDef: {
                flex: 1,
                editable: true,
                resizable: true,
            },
            headerHeight: 150
        },
        getDetailRowData: function (params) {
            params.successCallback(params.data.tasks);
        },
    },
    rowData: [
        {
            title: 'Phase 1',
            tasks: [
                {

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
                    finalReview: '',
                    finalReviewDate: '',
                    review: 'JY',
                    reviewDate: now,
                    prepared: 'WH',
                    preparedDate: now,
                    explanationRef: '01.01',
                    templateRef: '02.01',
                    mfiRef: '02',
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
                    explanationRef: '01.01',
                    templateRef: '02.01',
                    mfiRef: '03',
                    line: 1,
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

    const onGridReady = (params) => {
        gridApi.current = params.api;
        gridColumnApi.current = params.columnApi;

        const updateData = (data) => {
            setData(data);
        };

        fetch('https://www.ag-grid.com/example-assets/master-detail-data.json')
            .then((resp) => resp.json())
            .then((data) => updateData(data));
    };

    const onFirstDataRendered = (params) => {
        // setTimeout(function () {
        //     params.api.getDisplayedRowAtIndex(1).setExpanded(true);
        // }, 0);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
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
                    detailCellRendererParams={initialState.detailCellRendererParams}
                    onGridReady={onGridReady}
                    onFirstDataRendered={onFirstDataRendered.bind(this)}
                    rowData={initialState.rowData}
                />
            </div>
        </div>
    );
};

export default GridExample