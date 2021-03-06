'use strict';

import React, { useState, useRef } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RichSelectModule } from '@ag-grid-enterprise/rich-select';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import './AgGrid.scss';
import DateTime from "luxon/src/datetime";

const now = DateTime.now().toFormat('MM/dd');

const masterColumnDefs = [
    { field: 'title', label: 'Phase', cellRenderer: 'agGroupCellRenderer' }
];

const detailColumnDefs = [
    { field: 'finalReview', label: 'Final Review' },
    { field: 'finalReviewDate', label: 'Final Reviewed Date' },
    { field: 'review', label: 'Review' },
    { field: 'reviewDate', label: 'Reviewed Date' },
    { field: 'prepared', label: 'Prepare' },
    { field: 'preparedDate', label: 'Prepared Date' },
    { field: 'explanationRef', label: 'Explanation Ref' },
    { field: 'templateRef', label: 'Template Ref' },
    { field: 'mfiRef', label: 'MFI #' },
    { field: 'line', label: 'Line #' },
    { field: 'instruction', label: 'Instruction' },
];



const gridOptions = {
    modules: [
        ClientSideRowModelModule,
        RichSelectModule,
        MenuModule,
        ColumnsToolPanelModule,
    ],
    masterDetail: true,
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
    getDataPath: data => {
        return data.children; // path: "Erica/Malcolm"
    },
    columnDefs: masterColumnDefs
        // {
        //     field: 'gender',
        //     // cellRenderer: 'genderCellRenderer',
        //     cellEditor: 'agRichSelectCellEditor',
        //     cellEditorParams: {
        //         values: ['Male', 'Female'],
        //         // cellRenderer: 'genderCellRenderer',
        //     },
        // },
        // {
        //     field: 'country',
        //     cellEditor: 'agRichSelectCellEditor',
        //     cellEditorParams: {
        //         cellHeight: 50,
        //         values: ['Ireland', 'USA'],
        //     },
        // },
        // {
        //     field: 'city',
        //     cellEditor: 'agRichSelectCellEditor',
        //     cellEditorParams: cellCellEditorParams,
        // },
        // {
        //     field: 'address',
        //     cellEditor: 'agLargeTextCellEditor',
        //     minWidth: 550,
        // },
    ,
    detailCellRendererParams: {
        detailGridOptions: {
            columnDefs: detailColumnDefs,
            defaultColDef: {
                flex: 1,
            },
        },
        getDetailRowData: function (params) {
            params.successCallback(params.data.tasks);
        },
    },
    defaultColDef: {
        flex: 1,
        // minWidth: 130,
        editable: true,
        resizable: true,
    },
    // frameworkComponents: { genderCellRenderer: GenderCellRenderer },
};

// finalReview: '',
//     finalReviewDate: '',
//     review: 'JY',
//     reviewDate: now,
//     prepared: 'WH',
//     preparedDate: now,
//     explanation: '01.01',
//     template: '02.01',
//     line: 1,
//     instruction: 'Clean out the dog house'

const GridExample = (props) => {
  const gridApi = useRef({});
  const gridColumnApi = useRef({});

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;
  };

  const onCellValueChanged = (params) => {
    let colId = params.column.getId();
    if (colId === 'country') {
      let selectedCountry = params.data.country;
      let selectedCity = params.data.city;
      let allowedCities = countyToCityMap(selectedCountry);
      let cityMismatch = allowedCities.indexOf(selectedCity) < 0;
      if (cityMismatch) {
        params.node.setDataValue('city', null);
      }
    }
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
            masterDetail={true}
            // detailGridOptions={gridOptions.detailCellRendererParams.detailGridOptions}
            // getDetailRowData={gridOptions.detailCellRendererParams.getDetailRowData}
            detailCellRendererParams={gridOptions.detailCellRendererParams}
            // getDataPath={gridOptions.getDataPath}
            modules={gridOptions.modules}
            rowData={gridOptions.rowData}
            columnDefs={gridOptions.columnDefs}
            defaultColDef={gridOptions.defaultColDef}
            // frameworkComponents={gridOptions.frameworkComponents}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged.bind(this)}
        />
      </div>
    </div>
  );
};

function cellCellEditorParams(params) {
  let selectedCountry = params.data.country;
  let allowedCities = countyToCityMap(selectedCountry);
  return {
    values: allowedCities,
    formatValue: function (value) {
      return value + ' (' + selectedCountry + ')';
    },
  };
}
function countyToCityMap(match) {
  let map = {
    Ireland: ['Dublin', 'Cork', 'Galway'],
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  };
  return map[match];
}

export default GridExample;

