import { useCallback, useEffect, useState } from "react"
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import * as XLSX from 'xlsx';
import Tableview from "../../shared/components/Allocation/Tableview";
import Tableheadpanel from "../../shared/components/Allocation/Tableheadpanel";
import UploadForm from "../../shared/components/Allocation/Upload";
import Tablepagination from "../../shared/components/others/Tablepagination";
import { deleteAllAllocation, getallallocation, savebulkallocation } from "../../shared/services/apiallocation/apiallocation";

export default function AllocationPage(){
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
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
    let isMounted = true;
    const getallallocations = useCallback(async ()=>{
        const res= await getallallocation({first,rows,globalfilter,...colfilter});
        setTabledata(res?.resdata);
        setTotalRecords(res?.totallength);
    },[first,rows,globalfilter,colfilter]);

    useEffect(()=>{
        if(isMounted){
            getallallocations();
        }
        return(()=>isMounted = false);
    },[first,rows,globalfilter,colfilter])

    const cusfilter = (field, value) => {
        setcolFilter({...colfilter,...{[field]:value}})
    };

    const newform=()=>{
        setFormdata({});
        setVisible(true)
    }

    const Uploadform=()=>{
        setUploadVisible(true)
    }
    
    const editfrom=(data)=>{
        setFormdata(data);
        setVisible(true)
    }
    const onPage = (page) => {
        setPage(page)
        setFirst(rows *(page -1));
        setRows(rows);
      };

    // const handledelete = (id) => {
    //     confirmDialog({
    //         message: 'Do you want to delete this record?',
    //         header: 'Delete Confirmation',
    //         icon: 'pi pi-info-circle',
    //         defaultFocus: 'reject',
    //         acceptClassName: 'bg-red-500 ml-2 text-white p-2',
    //         rejectClassName: 'p-2 outline-none border-0',
    //         accept:async ()=>{
    //          await deleteproducts(id)
    //          toast.success("Sucessfully deleted")
    //          getallproduct()
    //         }
    //     });
    // };

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
    }

    const uploadfile = async (e)=>{
        e.preventDefault()
        setUploadVisible(true)
        setLoading(true)
        await savebulkallocation(File);
        getallallocations()
        setUploadVisible(false)
        setLoading(false)
    }

    return(
        <div>
            <div className="bg-white border rounded-3xl">
                <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter} Uploadform={Uploadform} handleDeleteAll={handleDeleteAll} />

                <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} editfrom={editfrom} 
                    cusfilter={cusfilter} filtervalues={filtervalues} />
                <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />       
                <UploadForm uploadfile={uploadfile} handleupload={handleupload} UploadVisible={UploadVisible} setUploadVisible={setUploadVisible} />
                <ConfirmDialog   />
            </div>
    
        </div>
    )
}
