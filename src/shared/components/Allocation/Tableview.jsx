/* eslint-disable react/prop-types */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';

const Tableview = (props) =>{
    const {tabledata,cusfilter,filtervalues,handlefiltervalue,first}=props

    // editfrom,handledelete
    const [filters, setFilters] = useState({
        Status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    
    });
    const [activeButton, setActiveButton] = useState(null);
    // const actionbotton = (rowData) => {
    //     return (
    //     <div className="flex gap-2">
    //         <button onClick={()=>editfrom(rowData)} className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2 " >
    //             <i className="fi fi-rr-pen-circle"></i>
    //         </button>
    //         <button onClick={()=>handledelete(rowData?._id)} className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2 " >
    //             <i className="fi fi-rr-trash"></i>
    //         </button>
    //     </div>
    //     )
    // }
    const statusItemTemplate = (option) => {
        return option;
    };
    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={filtervalues} onClick={()=>handlefiltervalue(options.field)} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter"  />;
    };
    const filterapply=(e)=>{
        return(
            <>
                <button onClick={()=>cusfilter(e.field,e.filterModel.constraints[0].value)}>Apply</button>
            </>
        )
    }
    const filterclear=(e)=>{
        return(
            <>
            <button  onClick={()=>{ e.filterModel.constraints[0].value = null;cusfilter(e.field,'');}}>Clear</button>
            </>
        )
    }
    const sno=(rowData,rowIndex)=>{
        return(
            <div>
                {first+rowIndex['rowIndex']+1}
            </div>
        )
    }
    const filterByProduct = (role) => {
        setActiveButton(role);
        setFilters({
            Product: { operator: FilterOperator.OR, constraints: [{ value: role, matchMode: FilterMatchMode.EQUALS }] }
        });
    };
    const columns = [
        {field: 'Region', header: 'Region', width:'300px',filter: true, filterElement: statusFilterTemplate, filterMatchMode: "custom", filterFunction: cusfilter},
        {field: 'Location', header: 'Location', width:'150px'},
        {field: 'Product', header: 'Product', width:'150px'},
        {field: 'Name', header: ' Name', width:'150px'},
        {field: 'Firm_Name', header: 'Firm Name', width:'150px'},
        {field: 'Mobile1', header: 'Mobile 1', width:'100px'},
        {field: 'Mobile2', header: 'Mobile 2', width:'100px'},
        {field: 'Compaign_Name', header: 'Campaign Name', width:'100px'},
        {field: 'Disposition', header: 'Disposition', width:'150px'},
        {field: 'Sub_Disposition', header: 'Sub Disposition', width:'150px'},
        {field: 'Remarks', header: 'Remarks(upto 1000O)words', filter: true, filterElement: statusFilterTemplate, filterMatchMode: "custom", filterFunction: cusfilter},
        {field: 'selectedTeamLeader', header: 'Team Leader', filter: true, filterElement: statusFilterTemplate, filterMatchMode: "custom", filterFunction: cusfilter}
       
    ];
    return(
        <div >
            <div >
            <div className="flex justify-center gap-4 mb-4">
                    <button onClick={() => filterByProduct(null)} className={`p-2 px-3 text-sm text-white bg-${activeButton === null ? 'blue' : 'green'}-500 rounded-t-lg `}>
                        ALL
                    </button>
                    <button onClick={() => filterByProduct('STPL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'STPL' ? 'blue' : 'green'}-500 rounded-t-lg `}>
                        STPL Products
                    </button>
                    <button onClick={() => filterByProduct('BL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'BL' ? 'blue' : 'green'}-500 rounded-t-lg `}>
                        BL Products
                    </button>
                    <button onClick={() => filterByProduct('PL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'PL' ? 'blue' : 'green'}-500 rounded-t-lg `}>
                        PL Products
                    </button>
                    <button onClick={() => filterByProduct('DL')} className={`p-2 px-3 text-sm text-white bg-${activeButton === 'DL' ? 'blue' : 'green'}-500 rounded-t-lg `}>
                        DL Products
                    </button>
                </div>
                <DataTable value={tabledata} scrollable scrollHeight="660px" className='!text-sm' filters={filters} stateStorage="session" stateKey="dt-state-demo-local" >
                    <Column header="S.No" style={{minWidth:'40px'}} body={sno} />
                    {/* <Column header="Action" body={actionbotton} style={{ minWidth: '80px' }} /> */}
                    {columns.map((col, i) => (
                        <Column key={i} field={col.field} filterApply={filterapply} filterClear={filterclear} filter={col.filter} filterElement={col.filterElement} header={col.header} style={{ minWidth: col.width }} />
                    ))}
                </DataTable>
            </div>
        </div>
    )
}

export default Tableview;