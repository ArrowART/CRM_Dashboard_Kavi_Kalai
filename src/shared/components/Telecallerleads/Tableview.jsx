/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { allocateteamleader } from "../../services/apiunallocation/apiunallocation";
import { InputTextarea } from "primereact/inputtextarea";
import { getDispositionColor, getSubDispositionColor } from "../Unallocation/optionColors";
import { Skeleton } from "primereact/skeleton";
import useRegionFilter from "../Unallocation/RegionFilters";
import useLocationFilter from "../Unallocation/LocationFilters";
import useAuth from "../../services/store/useAuth";
import { MultiSelect } from "primereact/multiselect";
import useCampanignFilter from "../Unallocation/CampaingnFilters";

export const Tableview = (props) => {
  const { tabledata, first, setFirst, updateData, cusfilter, isLoading, handleButtonClick, activeButton } = props;
  const [rowDataState, setRowDataState] = useState([]);
  const { userdetails } = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const { filters, regionFilterTemplate, filterApply, filterClear } = useRegionFilter(tabledata, cusfilter);
  const { filters1, LocationFilterTemplate, filterApply1, filterClear1 } = useLocationFilter(tabledata, cusfilter);
  const { filters2, campaignFilterTemplate, filterApply2, filterClear2 } = useCampanignFilter(tabledata, cusfilter);

  useEffect(() => {
    setFirst(0); // Reset pagination when changing the active button
  }, [activeButton]);
  useEffect(() => {
    const filteredData = tabledata.filter(row => {
      if (activeButton === 'Allocated Leads') {
        return parseDispositionValue(row.Disposition) === 'Allocated Leads';
      } else if (activeButton === 'Call Back') {
        return parseDispositionValue(row.Disposition) === 'Call Back';
      } else if (activeButton === 'Non Workable Leads') {
        return ['DNE', 'Not Int'].includes(parseDispositionValue(row.Disposition));
      } else if (activeButton === 'Followups') {
        return ['Followup', 'Future Followup'].includes(parseDispositionValue(row.Disposition));
      } else if (activeButton === 'Lead Submitted') {
        return ['Submit Lead', 'Lead Submitted'].includes(parseDispositionValue(row.Disposition));
      }
      return true;
    });
    setRowDataState(filteredData.map(row => ({
      ...row,
      selectedDisposition: parseDispositionValue(row.Disposition),
      selectedSubDisposition: parseSubDispositionValue(row.Sub_Disposition),
      timestamp: parseTimestamp(row.Disposition) || parseTimestamp(row.Sub_Disposition)
    })));
  }, [tabledata, activeButton]);

  useEffect(() => {
    const defaultSelectedColumns = ['timestamp', 'Remarks', 'sno', 'Productivity_Status'];
    if (tabledata && tabledata.length > 0) {
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
      let [value] = dispositionValue.split(' (');
      if (value === 'Lead Accepted' || value === 'Lead Declined') {
        value = 'Lead Submitted';
      }
      return value;
    }
    return null;
  };

  const formatMobileNumber = (mobileNumber, userDetails) => {
    const userRole = userDetails?.Role;
    if (userRole === 'SuperAdmin' || userRole === 'TeamLeader') {
      return mobileNumber;
    } else {
      return `${mobileNumber?.slice(0, 4)}******`;
    }
  };

  const formatMobileForCall = (mobileNumber) => {
    return `tel:${mobileNumber}`;
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

  const handleRemarksChange = (rowData, value) => {
    const updatedRowData = rowDataState.map(row => {
      if (row === rowData) {
        return { ...row, Remarks: value };
      }
      return row;
    });
    setRowDataState(updatedRowData);
  };

  const saveData = async (rowData) => {
    try {
      const requestBody = {
        data: [
          {
            ...rowData,
            Disposition: rowData.selectedDisposition,
            Sub_Disposition: rowData.selectedSubDisposition,
            Remarks: rowData.Remarks,
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
  const onPage = (event) => {
    setFirst(event.first);
  };

  const sno = (rowData, { rowIndex }) => (
    <div>{rowIndex + 1}</div>
  );

  const dispositionOptions = ['Submit Lead', 'Not Int', 'Call Back', 'DNE', 'Followup', 'Future Followup', 'Lead Submitted',];
  const subDispositionOptionsMap = {
    'Submit Lead': ['Docs to be collected', 'Login Pending', 'Interested'],
    'Not Int': ['No Need Loan', 'No Need as of Now', 'High ROI', 'Recently Availed', 'Reason Not Mentioned'],
    'Call Back': ['RNR', 'Call Waiting', 'Call Not Reachable', 'Busy Call after Some time'],
    'DNE': ['Wrong No', 'Call Not Connected', 'Doesnt Exisit', 'Customer is irate'],
    'Followup': ['Option M', 'Option N', 'Option O'],
    'Future Followup': ['Option W', 'Option X', 'Option Y'],
    'Lead Submitted': ['Logged WIP', 'In Credit', 'ABND', 'Login Pending', 'Declined Re-look', 'Fully Declined', 'Docs to be collected'],
  };

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

  return (
    <div>
      <div className="flex justify-start gap-4 p-3 mb-4 overflow-x-auto lg:justify-center">
        <button onClick={() => handleButtonClick('Allocated Leads')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Allocated Leads' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>
          Allocated Leads
        </button>
        <button onClick={() => handleButtonClick('Call Back')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Call Back' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>
          Workable Leads
        </button>
        <button onClick={() => handleButtonClick('Non Workable Leads')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Non Workable Leads' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>
          Non Workable Leads
        </button>
        <button onClick={() => handleButtonClick('Followups')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Followups' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>
          Followups
        </button>
        <button onClick={() => handleButtonClick('Lead Submitted')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Lead Submitted' ? 'blue' : 'cyan'}-500 rounded-t-lg`}>
          Lead Submitted Leads
        </button>
      </div>
      <div className="mx-4 mb-4">
        <MultiSelect
          value={selectedColumns}
          options={columnOptions}
          onChange={(e) => setSelectedColumns(e.value)}
          optionLabel="label"
          placeholder="Select Columns"
          maxSelectedLabels={4}
          className="border-2 border-cyan-300 w-fit md:w-20rem"
        />
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
          rows={rowsPerPage}
          first={first}
          onPage={onPage}
          className="text-sm"
          scrollable
          scrollHeight="550px"
          filters={{ ...filters, ...filters1, ...filters2 }}
        >
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
            <Column field="Product" header="Product" />
          )}
          {selectedColumns.includes('Name') && (
            <Column field="Name" header="Name" sortable style={{ width: '25%' }} />
          )}
          {selectedColumns.includes('Firm_Name') && (
            <Column field="Firm_Name" header="Firm Name" />
          )}
          {selectedColumns.includes('Mobile1') && (
            <Column field="Mobile1" header="Mobile 1" body={(rowData) => formatMobileNumber(rowData.Mobile1, userdetails())} />
          )}
          {selectedColumns.includes('Mobile2') && (
            <Column field="Mobile2" header="Mobile 2" body={(rowData) => formatMobileNumber(rowData.Mobile2, userdetails())} />
          )}
          <Column field="Call" header="Call"
            body={(rowData) => (
              <a href={formatMobileForCall(rowData.Mobile1, userdetails())}>
                <img src="./images/phonecall.png" alt="Call" />
              </a>
            )}
          />
          {selectedColumns.includes('Campaign_Name') && (
            <Column field="Campaign_Name" header="Campaign Name" filter filterElement={campaignFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply2} filterClear={filterClear2} sortable style={{ width: '25%' }} />
          )}
          {selectedColumns.includes('selectedTeamLeader') && (
            <Column field="selectedTeamLeader" header="Team Leader" style={{ minWidth: '10rem' }} />
          )}
          {selectedColumns.includes('selectedTelecaller') && (
            <Column field="selectedTelecaller" header="Tele Caller" style={{ minWidth: '10rem' }} />
          )}
          {selectedColumns.includes('Disposition') && (
            <Column
              field="Disposition"
              header="Disposition"
              body={(rowData) => (
                <Dropdown
                  value={rowData.selectedDisposition}
                  options={dispositionOptions}
                  onChange={(e) => handleDispositionChange(rowData, e)}
                  placeholder="Select Disposition"
                  optionLabel={(option) => option}
                  optionStyle={(option) => ({
                    color: 'white',
                    backgroundColor: getDispositionColor(option),
                  })}
                  style={{
                    width: '150px',
                    backgroundColor: getDispositionColor(rowData.selectedDisposition),
                  }}
                />
              )}
              width="150px"
            />
          )}
          {selectedColumns.includes('Sub_Disposition') && (
            <Column
              field="Sub_Disposition"
              header="Sub Disposition"
              body={(rowData) => (
                <Dropdown
                  value={rowData.selectedSubDisposition}
                  options={subDispositionOptionsMap[rowData.selectedDisposition] || []}
                  onChange={(e) => handleSubDispositionChange(rowData, e)}
                  placeholder="Select Sub Disposition"
                  optionLabel={(option) => option}
                  optionStyle={(option) => ({
                    color: 'white',
                    backgroundColor: getSubDispositionColor(option),
                  })}
                  style={{
                    width: '150px',
                    backgroundColor: getSubDispositionColor(rowData.selectedSubDisposition),
                  }}
                />
              )}
              width="150px"
            />
          )}
          {selectedColumns.includes('timestamp') && (
            <Column field="timestamp" header="Date & Time"
              body={(rowData) => (<div>{rowData.timestamp ? new Date(rowData.timestamp).toLocaleString() : ''}</div>)}
              style={{ minWidth: '10rem' }}
            />
          )}
          {selectedColumns.includes('Remarks') && (
            <Column
              field="Remarks"
              header="Remarks"
              width="200px"
              body={(rowData) => (
                <InputTextarea
                  value={rowData.Remarks}
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
                className={`p-2 px-4 text-white rounded-lg ${rowData.selectedDisposition && rowData.selectedSubDisposition ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
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
