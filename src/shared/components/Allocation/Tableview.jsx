/* eslint-disable react/prop-types */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { getDispositionColor, getSubDispositionColor } from './optionColors';
import { Skeleton } from 'primereact/skeleton';
import useRegionFilter from './RegionFilters';
import useLocationFilter from './LocationFilters';
import useCampanignFilter from '../Unallocation/CampaingnFilters';
import useProductFilter from '../Unallocation/ProductFilters';

const Tableview = (props) => {
    const { tabledata, filtervalues, handlefiltervalue, cusfilter, isLoading, productTypes, setActiveButton, activeButton } = props;
    const [rowDataState, setRowDataState] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0); 

    const { filters, regionFilterTemplate, filterApply, filterClear } = useRegionFilter(tabledata, cusfilter);
    const { filters1, LocationFilterTemplate, filterApply1, filterClear1 } = useLocationFilter(tabledata, cusfilter);
    const { filters2, campaignFilterTemplate, filterApply2, filterClear2 } = useCampanignFilter(tabledata, cusfilter);
    const { filters3, productFilterTemplate, filterApply3, filterClear3 } = useProductFilter(tabledata, cusfilter);



    useEffect(() => {
        setRowDataState(tabledata.map(row => ({ ...row, selectedDisposition: null, selectedSubDisposition: null })));
        setTotalRecords(tabledata.length);
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
        <div>{rowIndex + 1}</div>
      );

      const filterByProduct = (product) => {
        setActiveButton(product);
        if (product) {
            const filteredData = tabledata.filter(item => item.Product === product);
            setRowDataState(filteredData);
            setTotalRecords(filteredData.length);
        } else {
            setRowDataState(tabledata);
            setTotalRecords(tabledata.length);
        }
        setFirst(0); 
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

    const handleRemarksChange = (rowIndex, value) => {
        const updatedRowData = rowDataState.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, Remarks: value };
            }
            return row;
        });
        setRowDataState(updatedRowData);
    };

    return (
        <div>
            <div className='max-w-[70rem] mx-auto flex justify-between'>
                <div className="flex justify-start gap-4 p-3 overflow-x-auto lg:justify-center">
                    {productTypes.map((type) => (
                        <button 
                            key={type} 
                            onClick={() => filterByProduct(type)} 
                            className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === type ? 'blue' : 'cyan'}-500 rounded-t-lg`}
                        >
                            {type} Products
                        </button>
                    ))}
                </div>
                <div className="justify-end mb-3">
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
            </div>
            {isLoading ? (
                <div className="p-4">
                    <Skeleton height="3rem" className="mb-2"></Skeleton>
                    <Skeleton height="3rem" className="mb-2"></Skeleton>
                    <Skeleton height="3rem" width="100%"></Skeleton>
                </div>
            ) : (
                <DataTable
                    resizableColumns
                    stripedRows
                    showGridlines
                    tableStyle={{ minWidth: '50rem' }}
                    value={rowDataState}
                    paginator
                    rows={rowsPerPage}
                    first={first}
                    onPage={onPage}
                    scrollable
                    scrollHeight="550px"
                    className="text-sm"
                    filters={{ ...filters, ...filters1, ...filters2, ...filters3 }}
                    filterDisplay="menu"
                >
                    <Column field="sno" header="S.No" body={sno} />
                    <Column field="Region" header="Region" filter filterElement={regionFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply} filterClear={filterClear} sortable style={{ width: '25%' }} />
                    <Column field="Location" header="Location" filter filterElement={LocationFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply1} filterClear={filterClear1} sortable style={{ width: '25%' }} />
                    <Column field="Product" header="Product" filter filterElement={productFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply3} filterClear={filterClear3} sortable style={{ width: '25%' }}  />
                    <Column field="Name" header="Name" sortable style={{ width: '25%' }} />
                    <Column field="Firm_Name" header="Firm Name" />
                    <Column field="Mobile1" header="Mobile 1" />
                    <Column field="Mobile2" header="Mobile 2" />
                    <Column field="Campaign_Name" header="Campaign Name" filter filterElement={campaignFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply2} filterClear={filterClear2} sortable style={{ width: '20%' }}  />
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
                                style={{ width: '150px', backgroundColor: getDispositionColor(rowData.selectedDisposition) }}
                            />
                        )}
                        filter
                        filterElement={statusFilterTemplate}
                        width="150px"
                    />
                    <Column field="Sub_Disposition" header="Sub Disposition"
                        body={(rowData) => (
                            <Dropdown
                                value={rowData.selectedSubDisposition}
                                options={subDispositionOptionsMap[rowData.selectedDisposition] || []}
                                onChange={(e) => handleSubDispositionChange(rowData, e)}
                                placeholder="Select Sub Disposition"
                                optionLabel={(option) => option}
                                optionStyle={(option) => ({ color: 'white', backgroundColor: getSubDispositionColor(option) })}
                                style={{ width: '150px', backgroundColor: getSubDispositionColor(rowData.selectedSubDisposition) }}
                            />
                        )}
                        filter
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
            )}
            <div className='flex justify-end mr-3'>
                    <h1 className='justify-end py-4'>Total Records : {totalRecords}</h1>
                </div>
        </div>
    );
};

export default Tableview;

