/* eslint-disable react/prop-types */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';

const Tableview = (props) => {
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
        { field: 'Remarks', header: 'Remarks', width: '150px', filter: true, filterElement: statusFilterTemplate },
        { field: 'selectedTeamLeader', header: 'Team Leader', width: '170px', filter: true, filterElement: statusFilterTemplate },
        { field: 'selectedTelecaller', header: 'Tele Caller', width: '170px', filter: true, filterElement: statusFilterTemplate },
        {
            field: 'Disposition', header: 'Disposition', width: '150px', body: (rowData, { rowIndex }) => (
                <Dropdown value={rowData.selectedDisposition} options={dispositionOptions} className='text-sm' onChange={(e) => handleDispositionChange(rowIndex, e)} placeholder="Select Disposition" />
            )
        },
        {
            field: 'Sub_Disposition', header: 'Sub Disposition', width: '150px', body: (rowData) => (
                <Dropdown value={rowData.selectedSubDisposition} className='text-sm' options={subDispositionOptionsMap[rowData.selectedDisposition] || []} onChange={(e) => handleSubDispositionChange(rowData, e)} placeholder="Select Sub Disposition" />
            )
        }
    ];

    return (
        <div>
            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => filterByProduct(null)} className={`p-2 px-3 text-sm text-white bg-${activeButton === null ? 'blue' : 'green'}-500 rounded-t-lg`}>ALL</button>
                <button onClick={() => filterByProduct('STPL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'STPL' ? 'blue' : 'green'}-500 rounded-t-lg`}>STPL Products</button>
                <button onClick={() => filterByProduct('BL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'BL' ? 'blue' : 'green'}-500 rounded-t-lg`}>BL Products</button>
                <button onClick={() => filterByProduct('PL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'PL' ? 'blue' : 'green'}-500 rounded-t-lg`}>PL Products</button>
                <button onClick={() => filterByProduct('DL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'DL' ? 'blue' : 'green'}-500 rounded-t-lg`}>DL Products</button>
            </div>
            <div className="flex items-center justify-end mb-4">
                <span>Show:</span>
                <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="p-2 mx-2 rounded-lg border-3">
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
                scrollable
                scrollHeight="600px"
                className='text-sm'
            >
                {columns.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} body={col.body} />
                ))}
            </DataTable>
        </div>
    );
};

export default Tableview;
