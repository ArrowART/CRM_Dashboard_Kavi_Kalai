import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getalltelecallerallocation } from '../../shared/services/apitelecalleralloaction/apitelecallerallocation';
import Tablepagination from '../../shared/components/others/Tablepagination';
import { Teamtable } from '../../shared/components/Teams/Teamtable';
import { Tableheadpanel } from '../../shared/components/Teams/Tableheadpanel';
import { getallusers } from '../../shared/services/apiusers/apiusers';

export const TeamPage = () => {
  const [telecallerData, setTelecallerData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(10); // Number of rows per page
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [teleCallers, setTeleCallers] = useState([]);
  const [globalfilter, setglobalfilter]=useState('');
  const [colfilter, setcolFilter] = useState({});

  const fetchAllUsers = useCallback(async () => {
      try {
          const res = await getallusers();
          setTotalRecords(res?.totallength);
          const teamLeaders = res?.resdata.filter(user => user.Role === "Team Leader");
          const teleCallers = res?.resdata.filter(user => user.Role === "Telecaller");
          setTeamLeaders(teamLeaders);
          setTeleCallers(teleCallers);
      } catch (error) {
          console.error("Error fetching users:", error);
      }
  },[]);

  useEffect(() => {
      fetchAllUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    // Fetch telecaller allocation data when component mounts
    const fetchData = async () => {
      try {
        const response = await getalltelecallerallocation({first, rows, globalfilter, ...colfilter});
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
  },  [first, rows, globalfilter, colfilter]);

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
  <>
  <Tableheadpanel setglobalfilter={setglobalfilter} teamLeaders={teamLeaders} teleCallers={teleCallers} />
  <Teamtable  telecallerData={telecallerData} currentPage={currentPage} rows={rows}   />
  <Tablepagination
          rows={rows}
          page={currentPage}
          onPage={onPageChange}
          totalRecords={totalRecords}
        />
  </>
  );
};
