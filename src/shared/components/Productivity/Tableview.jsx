/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { allocateteamleader } from "../../services/apiunallocation/apiunallocation";
import { InputTextarea } from "primereact/inputtextarea";
import { getDispositionColor, getSubDispositionColor } from "./ProductivityoptionColors";
import useRegionFilter from "../Unallocation/RegionFilters";
import useLocationFilter from "../Unallocation/LocationFilters";
import useCampanignFilter from "../Unallocation/CampaingnFilters";
import useProductFilter from "../Unallocation/ProductFilters";
import { MultiSelect } from 'primereact/multiselect';
import { Skeleton } from "primereact/skeleton";


export const Tableview = (props) => {
  const { tabledata, first, setFirst, cusfilter, updateData, isLoading, setProductivityStatus } = props;
  const [rowDataState, setRowDataState] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [activeButton, setActiveButton] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const { filters, regionFilterTemplate, filterApply, filterClear } = useRegionFilter(tabledata, cusfilter);
  const { filters1, LocationFilterTemplate, filterApply1, filterClear1 } = useLocationFilter(tabledata, cusfilter);
  const { filters2, campaignFilterTemplate, filterApply2, filterClear2 } = useCampanignFilter(tabledata, cusfilter);
  const { filters3, productFilterTemplate, filterApply3, filterClear3 } = useProductFilter(tabledata, cusfilter);


  const columnOptions = [
    { label: 'S.No', value: 'sno' },
    { label: 'Region', value: 'Region' },
    { label: 'Location', value: 'Location' },
    { label: 'Product', value: 'Product' },
    { label: 'Name', value: 'Name' },
    { label: 'Firm Name', value: 'Firm_Name' },
    { label: 'Mobile 1', value: 'Mobile1' },
    { label: 'Mobile 2', value: 'Mobile2' },
    { label: 'Campaign Name', value: 'Campaign_Name' },
    { label: 'Team Leader', value: 'selectedTeamLeader' },
    { label: 'Tele Caller', value: 'selectedTelecaller' },
    { label: 'Productivity Status', value: 'Productivity_Status' },
    { label: 'Disposition', value: 'Disposition' },
    { label: 'Sub Disposition', value: 'Sub_Disposition' },
    { label: 'Date & Time', value: 'timestamp' },
    { label: 'Remarks', value: 'Remarks' },
  ];

  useEffect(() => {
    setFirst(0); // Reset pagination when changing the active button
  }, [activeButton]);

  useEffect(() => {
    if (tabledata) {
      setRowDataState(tabledata.map((row, index) => ({
        ...row,
        id: index, // Add a unique identifier 'id'
        selectedDisposition: parseDispositionValue(row.Disposition),
        selectedSubDisposition: parseSubDispositionValue(row.Sub_Disposition),
        timestamp: parseTimestamp(row.Disposition) || parseTimestamp(row.Sub_Disposition)
      })));
    }
  }, [tabledata]);

  useEffect(() => {
    const defaultSelectedColumns = ['timestamp', 'Remarks', 'sno', 'Productivity_Status'];
    const savedColumns1 = localStorage.getItem('selectedColumns1');
    if (savedColumns1) {
      setSelectedColumns(JSON.parse(savedColumns1));
    } else if (tabledata && tabledata.length > 0) {
      const allColumns = Object.keys(tabledata[0]);
      const validColumns = allColumns.filter(col => columnOptions.some(option => option.value === col));
      const initialSelectedColumns = [...new Set([...defaultSelectedColumns, ...validColumns])];
      setSelectedColumns(initialSelectedColumns);
    } else {
      setSelectedColumns(defaultSelectedColumns);
    }
  }, [tabledata]);

  const parseDispositionValue = (dispositionValue) => {
    if (dispositionValue) {
      const [value] = dispositionValue.split(' (');
      return value;
    }
    return null;
  };

  const parseSubDispositionValue = (subDispositionValue) => {
    if (subDispositionValue) {
      const [value] = subDispositionValue.split(' (');
      return value;
    }
    return null;
  };

  const parseTimestamp = (value) => {
    if (value) {
      const [_, timestamp] = value.split(' (');
      return timestamp.slice(0, -1);
    }
    return null;
  };

  const handleRemarksChange = (rowData, value) => {
    const updatedRowData = rowDataState.map(row => {
      if (row === rowData) {
        return { ...row, Remarks: value };
      }
      return row;
    });
    setRowDataState(updatedRowData);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const onPage = (event) => {
    setFirst(event.first);
  };

  const sno = (rowData, { rowIndex }) => (
    <div>{rowIndex + 1}</div>
  );

  const dispositionOptions = [
    'Submit Lead', 'Not Int', 'Call Back', 'DNE', 'Followup',
    'Future Followup','Lead Submitted', 'Lead Accepted', 'Lead Declined'
  ];

  const productivityStatusOptions = [
    'Logged', 'Accepted', 'Disbursed'
  ];

  const subDispositionOptionsMap = {
    'Submit Lead': ['Docs to be collected', 'Login Pending', 'Interested'],
    'Not Int': ['No Need Loan', 'No Need as of Now', 'High ROI', 'Recently Availed', 'Reason Not Mentioned'],
    'Call Back': ['RNR', 'Call Waiting', 'Call Not Reachable', 'Busy Call after Some time'],
    'DNE': ['Wrong No', 'Call Not Connected', 'Doesnt Exisit', 'Customer is irate', 'Switched Off'],
    'Followup': ['Option M', 'Option N', 'Option O'],
    'Future Followup': ['Option W', 'Option X', 'Option Y'],
    'Lead Submitted': ['Logged WIP', 'In Credit', 'ABND', 'Login Pending', 'Declined Re-look', 'Fully Declined', 'Docs to be collected'],
    'Lead Accepted': ['Logged WIP', 'In Credit', 'ABND', 'Login Pending', 'Declined Re-look', 'Fully Declined', 'Docs to be collected'],
    'Lead Declined': ['Customer Cancelled']
  };

  const handleProductivityStatusChange = (rowData, e) => {
    const updatedRowData = rowDataState.map(row => {
      if (row === rowData) {
        return { ...row, Productivity_Status: e.value };
      }
      return row;
    });
    setRowDataState(updatedRowData);
  };

  const handleDispositionChange = (rowData, e) => {
    const updatedRowData = rowDataState.map(row => {
      if (row === rowData) {
        return { ...row, selectedDisposition: e.value, selectedSubDisposition: null };
      }
      return row;
    });
    setRowDataState(updatedRowData);
  };

  const handleSubDispositionChange = (rowData, e) => {
    const updatedRowData = rowDataState.map(row => {
      if (row === rowData) {
        return { ...row, selectedSubDisposition: e.value };
      }
      return row;
    });
    setRowDataState(updatedRowData);
  };

  const actionbotton = () => {
    return (
        <div className="flex gap-4">
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2 ">
                    <i className="fi fi-rr-pen-circle"></i>
                </button>
            </div>
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2 " >
                    <i className="fi fi-rr-trash"></i>
                </button>
            </div>
        </div>
    )
}

  const saveData = async (rowData) => {
    try {
      const requestBody = {
        data: [
          {
            ...rowData,
            Disposition: rowData.selectedDisposition,
            Sub_Disposition: rowData.selectedSubDisposition,
            Remarks: rowData.Remarks,
            Productivity_Status: rowData.Productivity_Status,
          },
        ],
      };
      const res = await allocateteamleader(requestBody);
      toast.success("Disposition, Sub-Disposition, and Remarks saved successfully");
      await updateData();
    } catch (err) {
      toast.error("Error in saving data");
      console.log(err);
    }
  };

  const filterByProductivitystatus = (role) => {
    setActiveButton(role);
    setProductivityStatus(role); // Update the productivity status in the parent component
  };

  const handleColumnChange = (e) => {
    const newSelectedColumns = e.value;
    setSelectedColumns(newSelectedColumns);
    localStorage.setItem('selectedColumns1', JSON.stringify(newSelectedColumns));
  };

  const handleRefresh = () => {
    updateData();
    setFirst(0); 
    setRowDataState([]);
  };

  return (
    <div>
      <div className="flex justify-start gap-4 p-3 mb-4 overflow-x-auto lg:justify-center">
        <button onClick={() => filterByProductivitystatus('')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === null ? 'blue' : 'cyan'}-500 rounded-t-lg`}>All Leads</button>
        <button onClick={() => filterByProductivitystatus('Worked Leads')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Worked Leads' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>Worked Leads</button>
        <button onClick={() => filterByProductivitystatus('Reached')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Reached' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>Reached Leads</button>
        <button onClick={() => filterByProductivitystatus('Not Reached')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Not Reached' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>Not Reached Leads</button>
        <button onClick={() => filterByProductivitystatus('Submit Leads')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Submit Leads' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>Lead Submitted Leads</button>
        <button onClick={() => filterByProductivitystatus('Lead Accepted')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Lead Accepted' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>Lead Accepted Leads</button>
        <button onClick={() => filterByProductivitystatus('Declined')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Declined' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>Lead Declined Leads</button>
        <button onClick={() => filterByProductivitystatus('Not Updated')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Not Updated' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>Not Updated Leads</button>
      </div>
      <div className="flex gap-2 mx-4 mb-4">
        <MultiSelect
          value={selectedColumns}
          options={columnOptions}
          onChange={handleColumnChange}
          optionLabel="label"
          placeholder="Select Columns"
          maxSelectedLabels={4}
          className="border-2 border-cyan-300 w-fit md:w-20rem"
        />
         <button onClick={handleRefresh} className="p-2 mr-5 text-white bg-blue-500 rounded-lg h-9">
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
      <DataTable resizableColumns stripedRows showGridlines tableStyle={{ minWidth: '50rem' }}
        selection={selectedProducts} columnResizeMode="expand"
        onSelectionChange={e => setSelectedProducts(e.value)} value={rowDataState} rows={rowsPerPage}
        first={first} onPage={onPage} className="text-sm" scrollable scrollHeight="550px" filters={{ ...filters, ...filters1, ...filters2,...filters3 }}>
            <Column header="Action" style={{ minWidth: '80px' }} body={actionbotton} />
        {selectedColumns.includes('sno') && (
          <Column field="sno" header="S.No" body={sno} />
        )}
        {selectedColumns.includes('Region') && (
          <Column field="Region" header="Region" filter filterElement={regionFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply} filterClear={filterClear} sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('Location') && (
          <Column field="Location" header="Location" filter filterElement={LocationFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply1} filterClear={filterClear1} sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('Product') && (
          <Column field="Product" header="Product" filter filterElement={productFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply3} filterClear={filterClear3} sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('Name') && (
          <Column field="Name" header="Name" sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('Firm_Name') && (
          <Column field="Firm_Name" header="Firm Name" />
        )}
        {selectedColumns.includes('Mobile1') && (
          <Column field="Mobile1" header="Mobile 1" />
        )}
        {selectedColumns.includes('Mobile2') && (
          <Column field="Mobile2" header="Mobile 2" />
        )}
        {selectedColumns.includes('Campaign_Name') && (
          <Column field="Campaign_Name" header="Campaign Name" filter filterElement={campaignFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply2} filterClear={filterClear2} sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('selectedTeamLeader') && (
          <Column field="selectedTeamLeader" header="Team Leader" style={{ minWidth: '10rem' }} />
        )}
        {selectedColumns.includes('selectedTelecaller') && (
          <Column field="selectedTelecaller" header="Tele Caller" style={{ minWidth: '10rem' }} />
        )}
      {selectedColumns.includes('Productivity_Status') && (
  <Column
    field="Productivity_Status"
    header="Productivity Status"
    style={{ minWidth: '10rem' }}
    body={(rowData) => (
      (rowData.Productivity_Status === 'Logged' ||
       rowData.Productivity_Status === 'Accepted' ||
       rowData.Productivity_Status === 'Disbursed' ||
       rowData.Productivity_Status === 'Lead Accepted') ? (
        <Dropdown
          value={rowData.Productivity_Status}
          options={productivityStatusOptions}
          onChange={(e) => handleProductivityStatusChange(rowData, e)}
          placeholder="Select Productivity Status"
          optionLabel={(option) => option}
        />
      ) : (
        <div>{rowData.Productivity_Status}</div>
      )
    )}
  />
)}

{selectedColumns.includes('Disposition') && (
  <Column field="Disposition" header="Disposition"
    body={(rowData) => (
      <Dropdown value={rowData.selectedDisposition} options={dispositionOptions}
        onChange={(e) => handleDispositionChange(rowData, e)}
        placeholder="Select Disposition"
        optionLabel={(option) => option}
        optionStyle={(option) => ({ color: 'white', backgroundColor: getDispositionColor(option) })}
        style={{ width: '150px', backgroundColor: getDispositionColor(rowData.selectedDisposition) }}
      />
    )}
    width="150px"
  />
)}
        {selectedColumns.includes('Sub_Disposition') && (
  <Column field="Sub_Disposition" header="Sub Disposition"
    body={(rowData) => (
      <Dropdown value={rowData.selectedSubDisposition}
        options={subDispositionOptionsMap[rowData.selectedDisposition] || []}
        onChange={(e) => handleSubDispositionChange(rowData, e)}
        placeholder="Select Sub Disposition"
        optionLabel={(option) => option}
        optionStyle={(option) => ({ color: 'white', backgroundColor: getSubDispositionColor(option) })}
        style={{ width: '150px', backgroundColor: getSubDispositionColor(rowData.selectedSubDisposition) }}
      />
    )}
    width="150px"
  />
)}
        {selectedColumns.includes('timestamp') && (
          <Column field="timestamp" header="Date & Time"
            body={(rowData) => (
              <div>{rowData.timestamp ? new Date(rowData.timestamp).toLocaleString() : ''}</div>
            )}
            style={{ minWidth: '10rem' }}
          />
        )}
        {selectedColumns.includes('Remarks') && (
  <Column field="Remarks" header="Remarks" width="200px"
    body={(rowData) => (
      <InputTextarea value={rowData.Remarks}
        onChange={(e) => handleRemarksChange(rowData, e.target.value)}
        rows={3}
        className="w-full"
      />
    )}
  />
)}
        <Column
  body={(rowData) => (
    <button
      onClick={() => saveData(rowData)}
      disabled={!rowData.selectedDisposition || !rowData.selectedSubDisposition}
      className={`p-2 px-4 text-white rounded-lg ${
        rowData.selectedDisposition && rowData.selectedSubDisposition
          ? 'bg-blue-500'
          : 'bg-gray-400 cursor-not-allowed'
      }`}
    >
      Submit
    </button>
  )}
  style={{ minWidth: '10rem' }}
/>
      </DataTable>
      )}
    </div>

  );
};
