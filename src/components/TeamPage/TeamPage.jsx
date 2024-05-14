import { useCallback, useEffect, useState } from 'react';
import { deletetelecallerallocation, getalltelecallerallocation } from '../../shared/services/apitelecalleralloaction/apitelecallerallocation';
import Tablepagination from '../../shared/components/others/Tablepagination';
import { Teamtable } from '../../shared/components/Teams/Teamtable';
import { Tableheadpanel } from '../../shared/components/Teams/Tableheadpanel';
import { getallusers } from '../../shared/services/apiusers/apiusers';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import toast from 'react-hot-toast';

export const TeamPage = () => {
  const [telecallerData, setTelecallerData] = useState([]);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [visible, setVisible] = useState(false);
  const [formdata, setFormdata] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [teleCallers, setTeleCallers] = useState([]);
  const [globalfilter, setglobalfilter] = useState('');
  const [colfilter, setcolFilter] = useState({});

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await getallusers({ first, rows, globalfilter, ...colfilter });
      setTotalRecords(res?.totallength);
      const teamLeaders = res?.resdata.filter(user => user.Role === "TeamLeader");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getalltelecallerallocation({ first, rows, globalfilter, ...colfilter });
        console.log('Response:', response);
        if (Array.isArray(response.resdata)) {
          setTelecallerData(response.resdata);
          setTotalRecords(response.totallength);
        } else {
          console.error('resdata is not an array:', response.resdata);
        }
      } catch (error) {
        console.error('Error fetching telecaller allocation data:', error);
      }
    };
    fetchData();
  }, [first, rows, globalfilter, colfilter]);

  const onPage = (page) => {
    setPage(page)
    setFirst(rows * (page - 1));
    setRows(rows);
  };

  const cusfilter = (field, value) => {
    setcolFilter({ ...colfilter, ...{ [field]: value } })
  };

  const editfrom = (data) => {
    setFormdata(data);
    setVisible(true);
  }

  const handledelete = (id) => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'bg-red-500 ml-2 text-white p-2',
      rejectClassName: 'p-2 outline-none border-0',
      accept: async () => {
        await deletetelecallerallocation(id)
        toast.success("Successfully deleted")
        getalltelecallerallocation();
      }
    });
  };

  return (
    <>
      <Tableheadpanel
        setglobalfilter={setglobalfilter}
        teamLeaders={teamLeaders}
        teleCallers={teleCallers}
        setTelecallerData={setTelecallerData}
        telecallerData={telecallerData}
        visible={visible}
        setVisible={setVisible}
        formdata={formdata}
        setFormdata={setFormdata}
      />
      <Teamtable
        telecallerData={telecallerData}
        rows={rows}
        first={first}
        cusfilter={cusfilter}
        editfrom={editfrom}
        handledelete={handledelete}
      />
      <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />
      <ConfirmDialog />
    </>
  );
};
