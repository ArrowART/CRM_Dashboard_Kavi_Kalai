import { useCallback, useEffect, useState } from "react";
import Tableheadpanel from '../../shared/components/Telecallerleads/Tableheadpanel';
import { Tableview } from '../../shared/components/Telecallerleads/Tableview';
import { getallselectedteamleaderandtelecaller } from "../../shared/services/apiunallocation/apiunallocation";
import Tablepagination from "../../shared/components/others/Tablepagination";
import toast from "react-hot-toast";

export const TelecallerleadsPage = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(50);
  const [tabledata, setTabledata] = useState([]);
  const [colfilter, setColFilter] = useState({});
  const [globalfilter, setGlobalFilter] = useState('');
  const [filtervalues, setFilterValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('Allocated Leads');
  let isMounted = true;
  const getallteamleaderandtelecaller = useCallback(async () => {
    setIsLoading(true);
    try {
      const dispositionFilter = getDispositionFilter(activeButton);
      const res = await getallselectedteamleaderandtelecaller({ first, rows, globalfilter, dispositionfilter: dispositionFilter, ...colfilter });
      setTabledata(res?.resdata);
      setTotalRecords(res?.totallength);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [first, rows, globalfilter, colfilter, activeButton]);

  useEffect(() => {
    if (isMounted) {
    getallteamleaderandtelecaller();
}
return () => isMounted = false;
  }, [getallteamleaderandtelecaller]);

  const cusfilter = async (field, value) => {
    setColFilter(prev => ({ ...prev, [field]: value }));
    setFirst(0);
  };

  const updateData = async () => {
    await getallteamleaderandtelecaller();
  };

  const onPage = (newPage) => {
    setPage(newPage);
    setFirst(rows * (newPage - 1));
  };

  const handleButtonClick = async (button) => {
    setActiveButton(button);
    setColFilter({}); // Reset column filters
   
  };

  const getDispositionFilter = (button) => {
    let filter = '';
    switch (button) {
      case 'Non Workable Leads':
        filter = ['DNE', 'Not Int'];
        break;
      case 'Followups':
        filter = ['Followup', 'Future Followup'];
        break;
      case 'Lead Submitted':
        filter = ['Submit Lead', 'Lead Submitted', 'Lead Accepted', 'Lead Declined'];
        break;
      default:
        filter = [button];
    }
    return filter.join('|');
  };

  return (
    <div className="bg-white border rounded-2xl">
      <Tableheadpanel setGlobalFilter={setGlobalFilter} />
      <Tableview 
        tabledata={tabledata}
        filtervalues={filtervalues}
        handlefiltervalue={cusfilter}
        first={first}
        setFirst={setFirst}
        updateData={updateData}
        isLoading={isLoading}
        cusfilter={cusfilter}
        handleButtonClick={handleButtonClick}
        activeButton={activeButton}
      />
      <Tablepagination 
        page={page} 
        first={first} 
        rows={rows} 
        totalRecords={totalRecords} 
        onPage={onPage} 
      />
    </div>
  );
};
