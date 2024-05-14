/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

export const Tableview = (props) => {
    const { tabledata, cusfilter, filtervalues, handlefiltervalue, first } = props;
    const [activeButton, setActiveButton] = useState(null);
    const [rowDataState, setRowDataState] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    useEffect(() => {
        if (tabledata) {
            setRowDataState(tabledata.map(row => ({ ...row, selectedDisposition: null, selectedSubDisposition: null })));
        }
    }, [tabledata]);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
    };

    const onPage = (event) => {
        setFirst(event.first);
    };

    const statusItemTemplate = (option) => option;
    const statusFilterTemplate = (options) => (
        <Dropdown
            value={options.value}
            options={filtervalues}
            onClick={() => handlefiltervalue(options.field)}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            itemTemplate={statusItemTemplate}
            placeholder="Select One"
            className="p-column-filter"
        />
    );

    const sno = (rowData, { rowIndex }) => (
        <div>{first + rowIndex + 1}</div>
    );

    const filterByProduct = (role) => {
        setActiveButton(role);
        if (role) {
            const filteredData = tabledata.filter(item => item.Product === role);
            setRowDataState(filteredData);
        } else {
            setRowDataState(tabledata);
        }
    };

    const dispositionOptions = ['Submit Lead', 'Not Int', 'Call Back', 'DNE', 'Followup', 'Future Followup'];
    const subDispositionOptionsMap = {
        'Submit Lead': ['Docs to be collected', 'Login Pending', 'Interested'],
        'Not Int': ['No Need Loan', 'No Need as of Now', 'High ROI', 'Recently Availed', 'Reason Not Mentioned'],
        'Call Back': ['RNR', 'Call Waiting', 'Call Not Reachable', 'Busy Call after Some time'],
        'DNE': ['Wrong No', 'Call Not Connected', 'Doesnt Exisit', 'Customer is irate'],
        'Followup': ['Option M', 'Option N', 'Option O'],
        'Future Followup': ['Option W', 'Option X', 'Option Y']
    };

    const handleDispositionChange = (rowDataIndex, e) => {
        const updatedRowData = rowDataState.map((row, index) => {
            if (index === rowDataIndex) {
                return { ...row, selectedDisposition: e.value, selectedSubDisposition: null };
            }
            return row;
        });
        setRowDataState(updatedRowData);
    };

    const handleSubDispositionChange = (rowData, e) => {
        const updatedRowData = rowDataState.map((row) => {
            if (row === rowData) {
                return { ...row, selectedSubDisposition: e.value };
            }
            return row;
        });
        setRowDataState(updatedRowData);
    };

    const columns = [
        { field: 'sno', header: 'S.No', body: sno, width: '50px' },
        { field: 'Region', header: 'Region', width: '150px', filter: true, filterElement: statusFilterTemplate },
        { field: 'Location', header: 'Location', width: '150px' },
        { field: 'Product', header: 'Product', width: '150px' },
        { field: 'Name', header: 'Name', width: '150px' },
        { field: 'Firm_Name', header: 'Firm Name', width: '150px' },
        { field: 'Mobile1', header: 'Mobile 1', width: '100px' },
        { field: 'Mobile2', header: 'Mobile 2', width: '100px' },
        { field: 'Compaign_Name', header: 'Campaign Name', width: '100px' },
        { field: 'Remarks', header: 'Remarks (up to 1000 words)', filter: true, filterElement: statusFilterTemplate },
        { field: 'selectedTeamLeader', header: 'Team Leader', width: '170px', filter: true, filterElement: statusFilterTemplate },
        { field: 'selectedTelecaller', header: 'Tele Caller', width: '170px', filter: true, filterElement: statusFilterTemplate },
        {
            field: 'Disposition', header: 'Disposition', width: '150px', filter: true, filterElement: statusFilterTemplate, body: (rowData, { rowIndex }) => (
                <Dropdown value={rowData.selectedDisposition} options={dispositionOptions} onChange={(e) => handleDispositionChange(rowIndex, e)} placeholder="Select Disposition" />
            )
        },
        {
            field: 'Sub_Disposition', header: 'Sub Disposition', width: '150px', filter: true, filterElement: statusFilterTemplate, body: (rowData) => (
                <Dropdown value={rowData.selectedSubDisposition} options={subDispositionOptionsMap[rowData.selectedDisposition] || []} onChange={(e) => handleSubDispositionChange(rowData, e)} placeholder="Select Sub Disposition" />
            )
        }
    ];
    

    return (
        <div>
            <div className="flex justify-center gap-4 mb-4">
                {/* Buttons for filtering products */}
            </div>
            <div className="flex items-center justify-end mb-4">
                <span>Show:</span>
                <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="p-1 mx-2">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>1000</option>

                </select>
                <span>rows per page</span>
            </div>
            <DataTable
                value={rowDataState}
                paginator
                rows={rowsPerPage}
                first={first}
                onPage={onPage}
            >
                {columns.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} body={col.body} filter filterElement={col.filterElement} />
                ))}
            </DataTable>
        </div>
    );
};