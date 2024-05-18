/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { allocateteamleader } from "../../services/apiallocation/apiallocation";
import { InputTextarea } from "primereact/inputtextarea";
import { getDispositionColor, getSubDispositionColor } from "../Allocation/optionColors";
import { Skeleton } from "primereact/skeleton";
import useRegionFilter from "../Allocation/RegionFilters";
import useLocationFilter from "../Allocation/LocationFilters";

export const Tableview = (props) => {
  const { tabledata, first, setFirst,updateData,cusfilter } = props;
  const [rowDataState, setRowDataState] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [activeButton, setActiveButton] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {filters, regionFilterTemplate, filterApply, filterClear} = useRegionFilter(tabledata, cusfilter);
  const { filters1, LocationFilterTemplate,filterApply1,filterClear1 } = useLocationFilter(tabledata, cusfilter);
  useEffect(() => {
    if (tabledata) {
      console.log("Received tabledata:", tabledata);
      filterData(activeButton);
      setIsLoading(false)
    }
  }, [tabledata, activeButton]);
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
  const handleButtonClick = (button) => {
    setActiveButton(button);
    filterData(button);
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

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const onPage = (event) => {
    setFirst(event.first);
  };



  const sno = (rowData, { rowIndex }) => (
    <div>{first + rowIndex + 1}</div>
  );

  const dispositionOptions = ['Submit Lead', 'Not Int', 'Call Back', 'DNE', 'Followup', 'Future Followup', 'Lead Accepted', 'Lead Declined'];
  const subDispositionOptionsMap = {
    'Submit Lead': ['Docs to be collected', 'Login Pending', 'Interested'],
    'Not Int': ['No Need Loan', 'No Need as of Now', 'High ROI', 'Recently Availed', 'Reason Not Mentioned'],
    'Call Back': ['RNR', 'Call Waiting', 'Call Not Reachable', 'Busy Call after Some time'],
    'DNE': ['Wrong No', 'Call Not Connected', 'Doesnt Exisit', 'Customer is irate'],
    'Followup': ['Option M', 'Option N', 'Option O'],
    'Future Followup': ['Option W', 'Option X', 'Option Y'],
    'Lead Accepted': ['Logged WIP', 'In Credit', 'ABND', 'Login Pending', 'Declined Re-look', 'Fully Declined', 'Docs to be collected']
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

  const saveData = async (rowIndex) => {
    try {
      const row = rowDataState[rowIndex];
      const requestBody = {
        data: [{
          ...row,
          selectedTeamLeader: row.selectedTeamLeader,
          selectedTelecaller: row.selectedTelecaller,
          Remarks: row.Remarks,
        }],
      };
      const res = await allocateteamleader(requestBody);
      toast.success("Disposition, Sub-Disposition, and Remarks saved successfully");
      await updateData();
    } catch (err) {
      toast.error("Error in saving data");
      console.log(err);
    }
  };

  // const filterData = (filter) => {
  //   if (filter === null) {
  //     setRowDataState(tabledata.map(row => ({
  //       ...row,
  //       selectedDisposition: parseDispositionValue(row.Disposition),
  //       selectedSubDisposition: parseSubDispositionValue(row.Sub_Disposition),
  //       timestamp: parseTimestamp(row.Disposition) || parseTimestamp(row.Sub_Disposition)
  //     })));
  //   } else {
  //     const filteredData = tabledata.filter(row => {
  //       const disposition = parseDispositionValue(row.Disposition);
  //       const subDisposition = parseSubDispositionValue(row.Sub_Disposition);
  //       return (filter === 'Followups' && (disposition === 'Followup' || disposition === 'Future Followup')),(filter === 'Workableleads' && (disposition === 'Call Back' )) ||
  //              (filter === 'Lead Submitted' && disposition === 'Lead Accepted');
  //     }).map(row => ({
  //       ...row,
  //       selectedDisposition: parseDispositionValue(row.Disposition),
  //       selectedSubDisposition: parseSubDispositionValue(row.Sub_Disposition),
  //       timestamp: parseTimestamp(row.Disposition) || parseTimestamp(row.Sub_Disposition)
  //     }));
  //     setRowDataState(filteredData);
  //   }
  // };

  const filterData = (filter) => {
    const filteredData = tabledata.filter(row => {
      const disposition = parseDispositionValue(row.Disposition);
      const subDisposition = parseSubDispositionValue(row.Sub_Disposition);
  
      if (filter === null) {
        // Show all data except dispositions that have a specific section (Allocated Leads)
        return !['Followup', 'Future Followup', 'Call Back', 'DNE', 'Not Int', 'Submit Lead', 'Lead Accepted'].includes(disposition);
      } else if (filter === 'Followups') {
        return disposition === 'Followup' || disposition === 'Future Followup';
      } else if (filter === 'Workableleads') {
        return disposition === 'Call Back';
      } else if (filter === 'Nonworkableleads') {
        return disposition === 'DNE' || disposition === 'Not Int';
      } else if (filter === 'Lead Submitted') {
        return disposition === 'Submit Lead' || disposition === 'Lead Accepted';
      }
      return false;
    }).map(row => ({
      ...row,
      selectedDisposition: parseDispositionValue(row.Disposition),
      selectedSubDisposition: parseSubDispositionValue(row.Sub_Disposition),
      timestamp: parseTimestamp(row.Disposition) || parseTimestamp(row.Sub_Disposition)
    }));
  
    setRowDataState(filteredData);
  };
  return (
    <div>
       <div className="flex justify-start gap-4 p-3 mb-4 overflow-x-auto lg:justify-center">
  <button onClick={() => handleButtonClick(null)} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === null ? 'blue' : 'green'}-500 rounded-t-lg`}>
    Allocated Leads
  </button>
  <button onClick={() => handleButtonClick('Workableleads' )} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Workableleads' ? 'blue' : 'green'}-500 rounded-t-lg`}>
  Workable Leads
  </button>
  <button onClick={() => handleButtonClick('Nonworkableleads')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Nonworkableleads' ? 'blue' : 'green'}-500 rounded-t-lg`}>
    Non Workable Leads
  </button>
  <button onClick={() => handleButtonClick('Followups')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Followups' ? 'blue' : 'green'}-500 rounded-t-lg`}>
    Followups
  </button>
  <button onClick={() => handleButtonClick('Lead Submitted')} className={`flex-shrink-0 p-2 px-3 text-sm text-white bg-${activeButton === 'Lead Submitted' ? 'blue' : 'green'}-500 rounded-t-lg`}>
    Lead Submitted
  </button>
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
        scrollHeight="660px"
        filters={{ ...filters, ...filters1 }}
      >
        <Column field="sno" header="S.No" body={sno} />
        <Column field="Region" header="Region" filter filterElement={regionFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply} filterClear={filterClear} sortable style={{ width: '25%' }} />
        <Column field="Location" header="Location" filter filterElement={LocationFilterTemplate} showFilterMatchModes={false} showFilterMenuOptions={false} filterApply={filterApply1} filterClear={filterClear1} sortable style={{ width: '25%' }} />
        <Column field="Product" header="Product" />
        <Column field="Name" header="Name" sortable style={{ width: '25%' }} />
        <Column field="Firm_Name" header="Firm Name" />
        <Column field="Mobile1" header="Mobile 1" />
        <Column field="Mobile2" header="Mobile 2" />
        <Column field="Compaign_Name" header="Compaign Name" />
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
              optionStyle={(option) => ({
                color: 'white',
                backgroundColor: getDispositionColor(option)
              })}
              style={{
                width: '150px',
                backgroundColor: getDispositionColor(rowData.selectedDisposition)
              }}
            />
          )}
          filter
          
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
         
          body={(rowData, { rowIndex }) => (
            <InputTextarea
              value={rowData.Remarks}
              onChange={(e) => handleRemarksChange(rowIndex, e.target.value)}
              rows={3}
              className="w-full"
            />
          )}
        />
        <Column
          body={(rowData, { rowIndex }) => (
            <button
              onClick={() => saveData(rowIndex)}
              disabled={!rowData.selectedDisposition || !rowData.selectedSubDisposition}
              className={`p-2 px-4 text-white rounded-lg ${rowData.selectedDisposition && rowData.selectedSubDisposition ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}>
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
