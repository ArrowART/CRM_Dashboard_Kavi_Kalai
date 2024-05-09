/* eslint-disable react/prop-types */
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export const Teamtable = (props) => {
  const { telecallerData, globalfilter,first } = props;

  const sno = (rowData, rowIndex) => {
    return (
        <div>
            {first + rowIndex['rowIndex'] + 1}
        </div>
    )
}  
  return (
    <div className="container mx-auto">
      <DataTable
        value={telecallerData}
        globalfilter={globalfilter}
        className="mb-4 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"
      >
        <Column className="flex justify-center" header="S.No" style={{ minWidth: '40px' }} body={sno} />
        <Column header="Team Leader ID" body={(rowData) => rowData.teamleader.map((leader, index) => <div key={index}>{leader.User_Id}</div>)} />
        <Column header="Team Leader Name" body={(rowData) => rowData.teamleader.map((leader, index) => <div key={index}>{leader.First_Name}</div>)} />
        <Column header="Telecaller ID" body={(rowData) => rowData.telecaller.map((caller, index) => <div key={index}>{caller.User_Id}</div>)} />
        <Column header="Telecaller Name" body={(rowData) => rowData.telecaller.map((caller, index) => <div key={index}>{caller.First_Name}</div>)} />
      </DataTable>

    </div>
  )
}
