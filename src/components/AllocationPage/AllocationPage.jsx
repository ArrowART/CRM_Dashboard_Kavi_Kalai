import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import * as XLSX from 'xlsx';
import { deleteAllAllocation, getallallocation, savebulkallocation } from "../../shared/services/apiunallocation/apiunallocation";
import UploadForm from "../../shared/components/Allocation/Upload";
import Tableview from "../../shared/components/Allocation/Tableview";
import Tableheadpanel from "../../shared/components/Allocation/Tableheadpanel";

export default function AllocationPage(){
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [visible, setVisible] = useState(false);
    const [formdata, setFormdata]=useState({});
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata]=useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter]=useState('');
    const [filtervalues, setfiltervalues]=useState([]);
    const [UploadVisible,setUploadVisible]=useState(false);
    const [File, setFile] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    let isMounted = true;

    const getallallocations = useCallback(async ()=>{
        const res= await getallallocation({first,rows,globalfilter,...colfilter});
        setTabledata(res?.resdata);
        setIsLoading(false);
        setTotalRecords(res?.totallength);
        
        const uniqueProductTypes = Array.from(new Set(res?.resdata.map(item => item.Product)));
        setProductTypes(uniqueProductTypes);

    },[first,rows,globalfilter,colfilter]);

    useEffect(()=>{
        if(isMounted){
            getallallocations();
        }
        return(()=>isMounted = false);
    },[first,rows,globalfilter,colfilter]);

    const cusfilter = (field, value) => {
        setcolFilter({...colfilter,...{[field]:value}})
    };

    const updateTableData = async () => {
        await getallallocations();
    };

    const newform=()=>{
        setFormdata({});
        setVisible(true)
    };

    const Uploadform=()=>{
        setUploadVisible(true)
    };
    
    const editfrom=(data)=>{
        setFormdata(data);
        setVisible(true)
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleDeleteAll =()=>{
        confirmDialog({
            message: 'Do you want to delete all this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 ml-2 text-white p-2',
            rejectClassName: 'p-2 outline-none border-0',
            accept: async () => {
                await deleteAllAllocation();
                getallallocations();
                console.log("All data deleted successfully");
            }
        });
    };

    const handleupload = (e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            setFile(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const uploadfile = async (e)=>{
        e.preventDefault();
        setUploadVisible(true);
        setLoading(true);
        await savebulkallocation(File);
        getallallocations();
        setUploadVisible(false);
        setLoading(false);
    };

    return (
        <div>
            <div className="bg-white border rounded-2xl">
                <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter} Uploadform={Uploadform} handleDeleteAll={handleDeleteAll} 
                    tabledata={tabledata} updateTableData={updateTableData} loading={loading}
                    setLoading={setLoading} />

                <Tableview 
                    tabledata={tabledata} 
                    totalRecords={totalRecords} 
                    first={first} 
                    rows={rows} 
                    onPageChange={onPageChange} 
                    cusfilter={cusfilter} 
                    filtervalues={filtervalues} 
                    isLoading={isLoading} 
                    productTypes={productTypes} 
                    activeButton={activeButton}
                    setActiveButton={setActiveButton}
                />     
                <UploadForm uploadfile={uploadfile} handleupload={handleupload} UploadVisible={UploadVisible} setUploadVisible={setUploadVisible} 
                />
                <ConfirmDialog />
            </div>
        </div>
    );
}
