/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";

import toast from "react-hot-toast";
import { allocateteamleader } from "../../services/apiallocation/apiallocation";

export const Tableview = (props) => {
  const { tabledata, filtervalues, handlefiltervalue, first } = props;
  const [rowDataState, setRowDataState] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    if (tabledata) {
      setRowDataState(tabledata.map(row => ({
        ...row,
        selectedDisposition: parseDispositionValue(row.Disposition),
        selectedSubDisposition: parseSubDispositionValue(row.Sub_Disposition),
        timestamp: parseTimestamp(row.Disposition) || parseTimestamp(row.Sub_Disposition)
      })));
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

  const handleSubmit = async (rowData) => {
    try {
      const requestBody = {
        data: [rowData],
        selectedTeamLeader: rowData.selectedTeamLeader,
        selectedTelecaller: rowData.selectedTelecaller,
      };
      const res = await allocateteamleader(requestBody);
      toast.success("Disposition and Sub-Disposition saved successfully");
    } catch (err) {
      toast.error("Error in saving data");
      console.log(err);
    }
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
    },
    {
      field: 'timestamp',
      header: 'Date & Time',
      width: '170px',
      body: (rowData) => (
        <div>{rowData.timestamp ? new Date(rowData.timestamp).toLocaleString() : ''}</div>
      )
    },
    { field: 'Remarks', header: 'Remarks', filter: true, filterElement: statusFilterTemplate },
    {
      field: 'action', header: 'Action', width: '170px', body: (rowData) => (
        <Button label="Submit" onClick={() => handleSubmit(rowData)} style={{ backgroundColor: 'green', borderColor: 'green', color: 'white',padding:'2px' }} />
      )
    }
    
  ];

  return (
    <div>
      <DataTable
        value={rowDataState}
        rows={rowsPerPage}
        first={first}
        onPage={onPage}
        className="text-sm"
        scrollHeight="700px"
      >
        {columns.map((col, index) => (
          <Column key={index} field={col.field} header={col.header} body={col.body}  />
        ))}
      </DataTable>
    </div>
  );
};                   