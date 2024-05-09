import { useCallback, useEffect, useState } from 'react';
import { getalltelecallerallocation } from '../../shared/services/apitelecalleralloaction/apitelecallerallocation';
import Tablepagination from '../../shared/components/others/Tablepagination';
import { Teamtable } from '../../shared/components/Teams/Teamtable';
import { Tableheadpanel } from '../../shared/components/Teams/Tableheadpanel';
import { getallusers } from '../../shared/services/apiusers/apiusers';

export const TeamPage = () => {
  const [telecallerData, setTelecallerData] = useState([]);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
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


  return (
    <>
      <Tableheadpanel setglobalfilter={setglobalfilter} teamLeaders={teamLeaders} teleCallers={teleCallers} setTelecallerData={setTelecallerData}
        telecallerData={telecallerData} />
      <Teamtable telecallerData={telecallerData} rows={rows} first={first} cusfilter={cusfilter} />
      <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />
    </>
  );
};
