import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useState } from "react";

export const Tableview = (props) => {
    const { tabledata, editfrom, cusfilter, first, filtervalues, handlefiltervalue } = props;
    const [filters, setFilters] = useState({
        Role: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    });

    const actionbotton = (rowData) => {
        return (
            <div className="flex justify-center gap-2">
                <button onClick={() => editfrom(rowData)} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900" >
                    <i className="fi fi-rr-edit-alt"></i>
                    <span>Edit</span>
                </button>
            </div>
        )
    }

    const statusItemTemplate = (option) => {
        return option;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={filtervalues} onClick={() => handlefiltervalue(options.field)} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" />;
    };

    const filterapply = (e) => {
        return (
            <>
                <button onClick={() => cusfilter(e.field, e.filterModel.constraints[0].value)} className="text-sm text-gray-600 hover:text-gray-800">Apply</button>
            </>
        )
    }

    const filterclear = (e) => {
        return (
            <>
                <button onClick={() => { e.filterModel.constraints[0].value = null; cusfilter(e.field, ''); }} className="text-sm text-gray-600 hover:text-gray-800">Clear</button>
            </>
        )
    }

    const sno = (rowData, rowIndex) => {
        return (
            <div>
                {first + rowIndex['rowIndex'] + 1}
            </div>
        )
    }

    const columns = [
        { field: 'User_Id', header: 'User Id', width: "140px" },
        { field: 'First_Name', header: 'First Name', width: "200px" },
        { field: 'Last_Name', header: 'Last Name', width: "200px" },
        { field: 'Email', header: 'Email', width: "200px" },
        { field: 'Password', header: 'Password', width: "140px" },
        { field: 'Role', header: 'Role', width: "200px", filter: false, filterElement: statusFilterTemplate, filterMatchMode: "custom", filterFunction: cusfilter },
        { field: 'User_Status', header: 'Status', width: "200px" },
    ];

    const filterByRole = (role) => {
        setFilters({
            Role: { operator: FilterOperator.OR, constraints: [{ value: role, matchMode: FilterMatchMode.EQUALS }] }
        });
    };

    return (
        <div>
            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => filterByRole(null)} className="text-sm text-gray-600 hover:text-gray-800">All Users</button>
                <button onClick={() => filterByRole('Team Leader')} className="text-sm text-gray-600 hover:text-gray-800">Team Leaders</button>
                <button onClick={() => filterByRole('Telecaller')} className="text-sm text-gray-600 hover:text-gray-800">Telecallers</button>
            </div>
            <DataTable value={tabledata} scrollable scrollHeight="400px" className='!text-sm shadow-lg rounded-lg overflow-hidden' filters={filters} stateStorage="session" stateKey="dt-state-demo-local" >
                <Column className="flex justify-center" header="S.No" style={{ minWidth: '40px' }} body={sno} />
                <Column header="Action" style={{ minWidth: '80px' }} body={actionbotton} />
                {columns.map((col, i) => (
                    <Column key={i} field={col.field} filterApply={filterapply} filterClear={filterclear} filter={col.filter} filterElement={col.filterElement} header={col.header} />
                ))}
            </DataTable>
        </div>
    )
}
