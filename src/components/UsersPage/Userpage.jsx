import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import toast from "react-hot-toast";
import Tableheadpanel from "../../shared/components/Users/Tableheadpanel";
import Addandeditform from "../../shared/components/Users/Addandeditform";
import { Tableview } from "../../shared/components/Users/Tableview";
import { getallusers, saveusers, updateusers } from "../../shared/services/apiusers/apiusers";
import Tablepagination from "../../shared/components/others/Tablepagination";

export default function Userspage(){

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [visible, setVisible] = useState(false);
    const [formdata, setFormdata]=useState({});
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata]=useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter]=useState('');
    const [filtervalues,setfiltervalues]=useState([]);
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [teleCallers, setTeleCallers] = useState([]);

    const fetchAllUsers = useCallback(async () => {
        try {
            const res = await getallusers({first, rows, globalfilter, ...colfilter});
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);
            const teamLeaders = res?.resdata.filter(user => user.Role === "Team Leader");
            const teleCallers = res?.resdata.filter(user => user.Role === "Telecaller");
            setTeamLeaders(teamLeaders);
            setTeleCallers(teleCallers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, [first, rows, globalfilter, colfilter]);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const onPage = (page) => {
        setPage(page)
        setFirst(rows *(page -1));
        setRows(rows);
    };
    const cusfilter = (field, value) => {
        setcolFilter({...colfilter,...{[field]:value}})
    };
    const handlechange = (e)=>{
        if(e.target.files){
            setFormdata({...formdata,...{[e.target.name]:e.target.files}});
        }
        else {
            setFormdata({...formdata,...{[e.target.name]:e.target.value}});
        }
    }
    const handlesave=async (e)=>{
        e.preventDefault();
        setLoading(true);
        await saveusers(formdata);
        toast.success("Sucessfully saved");
        fetchAllUsers();
        setVisible(false);
        setLoading(false);
    }
    const newform=()=>{
        setFormdata({});
        setVisible(true);
    }
    const editfrom=(data)=>{
        setFormdata(data);
        setVisible(true);
    }
    const handleupdate=async (e)=>{
        e.preventDefault();
        setLoading(true);
        await updateusers(formdata);
        toast.success("Sucessfully updated");
        fetchAllUsers();
        setVisible(false);
        setLoading(false);
    }
    return(
        <div>
            <div className="bg-white border rounded-3xl">
                <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter} teamLeaders={teamLeaders} 
                teleCallers={teleCallers} />

                <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} editfrom={editfrom} 
                cusfilter={cusfilter} filtervalues={filtervalues} onPage={onPage} />

                <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />

                <Addandeditform visible={visible} setVisible={setVisible} loading={loading} formdata={formdata} 
                setFormdata={setFormdata} handlechange={handlechange} handlesave={handlesave} handleupdate={handleupdate} />
                <ConfirmDialog />
            </div>
        </div>
    )
}
