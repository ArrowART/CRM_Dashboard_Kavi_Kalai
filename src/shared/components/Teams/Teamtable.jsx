/* eslint-disable react/prop-types */
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export const Teamtable = (props) => {
  const { telecallerData, globalfilter, first, editfrom, handledelete } = props;

  const sno = (rowData, rowIndex) => {
    return (
      <div>
        {first + rowIndex['rowIndex'] + 1}
      </div>
    )
  }

  const actionbotton = (rowData) => {
    return (
      <div className="flex gap-2">
        <button onClick={() => editfrom(rowData)} className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2 " >
          <i className="fi fi-rr-pen-circle"></i>
        </button>
        <button onClick={() => handledelete(rowData?._id)} className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2 " >
          <i className="fi fi-rr-trash"></i>
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <DataTable
        value={telecallerData}
        resizableColumns 
        stripedRows
        showGridlines tableStyle={{ minWidth: '50rem' }}
        globalFilter={globalfilter}
        className="mb-4 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"
      >
        <Column className="flex justify-center" header="S.No" style={{ minWidth: '40px' }} body={sno} />
        <Column header="Action" style={{ minWidth: '60px' }} body={actionbotton} />
        <Column header="Team Leader ID" body={(rowData) => rowData.teamleader?.map((leader, index) => <div key={index}>{leader.UserName}</div>)} />
        <Column header="Team Leader Name" body={(rowData) => rowData.teamleader?.map((leader, index) => <div key={index}>{leader.First_Name}</div>)} />
        <Column header="Telecaller ID" body={(rowData) => rowData.telecaller?.map((caller, index) => <div key={index}>{caller.UserName}</div>)} />
        <Column header="Telecaller Name" body={(rowData) => rowData.telecaller?.map((caller, index) => <div key={index}>{caller.First_Name}</div>)} />
      </DataTable>
    </div>
  )
}
