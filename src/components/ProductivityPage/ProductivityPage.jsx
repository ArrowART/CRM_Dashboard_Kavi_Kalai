import { useCallback, useEffect, useState } from "react";
import { getallallProductivity } from "../../shared/services/apiunallocation/apiunallocation";
import Tablepagination from "../../shared/components/others/Tablepagination";
import Tableheadpanel from "../../shared/components/Productivity/Tableheadpanel";
import { Tableview } from "../../shared/components/Productivity/Tableview";

export const ProductivityPage = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);
  const [tabledata, setTabledata] = useState([]);
  const [colfilter, setcolFilter] = useState({});
  const [globalfilter, setglobalfilter] = useState('');
  const [filtervalues, setfiltervalues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productivityStatus, setProductivityStatus] = useState('');

  let isMounted = true;

  const getallteamleaderandtelecaller = useCallback(async () => {
    const res = await getallallProductivity({ first, rows, globalfilter, productivityStatus, ...colfilter });
    setIsLoading(false);
    setTabledata(res?.resdata);
    setTotalRecords(res?.totallength);
  }, [first, rows, globalfilter, colfilter, productivityStatus]);

  useEffect(() => {
    if (isMounted) {
      getallteamleaderandtelecaller();
    }
    return () => isMounted = false;
  }, [first, rows, globalfilter, colfilter, productivityStatus]);

  const cusfilter = (field, value) => {
    setcolFilter({ ...colfilter, ...{ [field]: value } });
  };

  const updateData = async () => {
    await getallteamleaderandtelecaller();
  };

  const onPage = (page) => {
    setPage(page);
    setFirst(rows * (page - 1));
    setRows(rows);
  };

  return (
    <div className="bg-white border rounded-2xl">
      <Tableheadpanel setglobalfilter={setglobalfilter} />
      <Tableview
        tabledata={tabledata}
        totalRecords={totalRecords}
        first={first}
        cusfilter={cusfilter}
        filtervalues={filtervalues}
        updateData={updateData}
        isLoading={isLoading}
        setProductivityStatus={setProductivityStatus}
        setFirst={setFirst}
      />
      <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage}  />
    </div>
  );
};
