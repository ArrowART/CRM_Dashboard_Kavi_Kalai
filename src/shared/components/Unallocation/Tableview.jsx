/* eslint-disable react/prop-types */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { getDispositionColor, getSubDispositionColor } from './optionColors';
import { MultiSelect } from 'primereact/multiselect';

const Tableview = ({ tabledata, totalRecords, first, rows, onPageChange, editfrom, cusfilter, filtervalues, handledelete, isLoading, selectedRows, setSelectedRows,updateTableData }) => {
    const [rowsPerPage, setRowsPerPage] = useState(rows);
    const [tempFilterValues, setTempFilterValues] = useState(filtervalues);
    const [rowDataState, setRowDataState] = useState([]);

    useEffect(() => {
        setTempFilterValues(filtervalues);
    }, [filtervalues]);

    useEffect(() => {
        setRowDataState(tabledata.map(row => ({
            ...row,
            selectedDisposition: row.Disposition || null,
            selectedSubDisposition: row.Sub_Disposition || null
        })));
    }, [tabledata]);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        onPageChange({ first: 0, rows: event.target.value });
    };

    const statusItemTemplate = (option) => option;

    const handleApplyFilters = (key) => {
        cusfilter(key, tempFilterValues[key]);
        onPageChange({ first: 0, rows: rowsPerPage });
    };

    const handleClearFilters = (key) => {
        setTempFilterValues(prev => ({ ...prev, [key]: null }));
        cusfilter(key, null);
        onPageChange({ first: 0, rows: rowsPerPage });
    };

    const renderColumnFilter = (key) => (
        <div>
            <MultiSelect
                value={tempFilterValues[key]}
                options={[...new Set(tabledata.map(item => item[key]))].map(value => ({ label: value, value }))}
                onChange={(e) => setTempFilterValues(prev => ({ ...prev, [key]: e.value }))}
                placeholder={`Select ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                className="p-column-filter"
            />
            <div className="flex justify-between mt-8">
                <Button label="Clear" onClick={() => handleClearFilters(key)} className="p-1 text-white bg-blue-500" />
                <Button label="Apply" onClick={() => handleApplyFilters(key)} className="p-1 mx-1 text-white bg-blue-500" />
            </div>
        </div>
    );

    const actionButton = (rowData) => (
        <div className="flex gap-4">
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2" onClick={() => editfrom(rowData)}>
                    <i className="fi fi-rr-pen-circle"></i>
                </button>
            </div>
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2" onClick={() => handledelete(rowData._id)}>
                    <i className="fi fi-rr-trash"></i>
                </button>
            </div>
        </div>
    );

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

    const handleSubDispositionChange = (rowDataIndex, e) => {
        const updatedRowData = rowDataState.map((row, index) => {
            if (index === rowDataIndex) {
                return { ...row, selectedSubDisposition: e.value };
            }
            return row;
        });
        setRowDataState(updatedRowData);
    };

    const handleRemarksChange = (rowIndex, value) => {
        const updatedRowData = rowDataState.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, Remarks: value };
            }
            return row;
        });
        setRowDataState(updatedRowData);
    };

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

    const handleRefresh = () => {
        updateTableData();
        setFirst(0); 
        setRowDataState([]);
      };

    return (
        <div>
            <div className='flex justify-start mx-5 '>
                <div className="justify-end mb-3 mr-3">
                    <span>Show:</span>
                    <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="p-2 mx-2 rounded-lg border-3">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={1000}>1000</option>

                    </select>
                    <span>rows per page</span>
                </div>
                <button onClick={handleRefresh} className="p-2 mb-3 text-white bg-blue-500 rounded-lg">
                <i className="fi fi-br-rotate-right"></i>
            </button>
            </div>
            {isLoading ? (
                <div className="p-4">
                    <Skeleton height="3rem" className="mb-2"></Skeleton>
                    <Skeleton height="3rem" className="mb-2"></Skeleton>
                    <Skeleton height="3rem" width="100%"></Skeleton>
                </div>
            ) : (
                <>
                    <DataTable
                        resizableColumns
                        stripedRows
                        showGridlines
                        value={rowDataState}
                        paginator
                        rows={rowsPerPage}
                        first={first}
                        onPage={onPageChange}
                        scrollable
                        scrollHeight="550px"
                        className="text-sm"
                        selection={selectedRows}
                        onSelectionChange={(e) => {
                            const currentPageRows = rowDataState.slice(first, first + rowsPerPage);
                            const newSelectedRows = e.value.filter(row => currentPageRows.includes(row));
                            setSelectedRows(newSelectedRows);
                        }}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                        <Column header="Action" style={{ minWidth: '80px' }} body={actionButton} />
                        <Column field="sno" header="S.No" body={(rowData, { rowIndex }) => <div>{rowIndex + 1}</div>} />
                        <Column field="Region" header="Region" filter filterElement={renderColumnFilter('Region')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Location" header="Location" filter filterElement={renderColumnFilter('Location')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Product" header="Product" filter filterElement={renderColumnFilter('Product')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Campaign_Name" header="Campaign Name" filter filterElement={renderColumnFilter('Campaign_Name')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Name" header="Name" sortable style={{ width: '25%' }} />
                        <Column field="Firm_Name" header="Firm Name" />
                        <Column field="Mobile1" header="Mobile 1" />
                        <Column field="Mobile2" header="Mobile 2" />
                        <Column field="selectedTeamLeader" header="Team Leader" style={{ minWidth: '10rem' }} />
                        <Column field="selectedTelecaller" header="Tele Caller" style={{ minWidth: '10rem' }} />
                        <Column
                            field="Disposition"
                            header="Disposition"
                            body={(rowData, { rowIndex }) => (
                                <Dropdown
                                    value={rowData.selectedDisposition}
                                    options={dispositionOptions}
                                    onChange={(e) => handleDispositionChange(rowIndex, e)}
                                    placeholder="Select Disposition"
                                    optionLabel={(option) => option}
                                    optionStyle={(option) => ({ color: 'white', backgroundColor: getDispositionColor(option) })}
                                    style={{
                                        width: '150px',
                                        backgroundColor: getDispositionColor(rowData.selectedDisposition)
                                    }}
                                />
                            )}
                            filter
                            filterElement={statusFilterTemplate}
                            width="150px"
                        />
                        <Column
                            field="Sub_Disposition"
                            header="Sub Disposition"
                            body={(rowData, { rowIndex }) => (
                                <Dropdown
                                    value={rowData.selectedSubDisposition}
                                    options={subDispositionOptionsMap[rowData.selectedDisposition] || []}
                                    onChange={(e) => handleSubDispositionChange(rowIndex, e)}
                                    placeholder="Select Sub Disposition"
                                    optionLabel={(option) => option}
                                    optionStyle={(option) => ({
                                        color: 'white',
                                        backgroundColor: getSubDispositionColor(option)
                                    })}
                                    style={{
                                        width: '150px',
                                        backgroundColor: getSubDispositionColor(rowData.selectedSubDisposition)
                                    }}
                                />
                            )}
                            filter
                            filterElement={statusFilterTemplate}
                            width="150px"
                        />
                        <Column
                            field="timestamp"
                            header="Date & Time"
                            body={(rowData) => (
                                <div>{rowData.timestamp ? new Date(rowData.timestamp).toLocaleString() : ''}</div>
                            )}
                            style={{ minWidth: '10rem' }}
                        />
                        <Column
                            field="Remarks"
                            header="Remarks"
                            width="200px"
                            filter
                            filterElement={statusFilterTemplate}
                            body={(rowData, { rowIndex }) => (
                                <InputTextarea
                                    value={rowData.Remarks}
                                    onChange={(e) => handleRemarksChange(rowIndex, e.target.value)}
                                    rows={3}
                                    className="w-full"
                                />
                            )}
                        />
                    </DataTable>
                    <div className='flex justify-end mr-3'>
                        <h1 className='justify-end py-4'>Total Records: {totalRecords}</h1>
                    </div>
                </>
            )}
        </div>
    );
};

export default Tableview;
