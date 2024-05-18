import { useCallback, useEffect, useState } from "react";
import Tableheadpanel from '../../shared/components/Telecallerleads/Tableheadpanel';
import { Tableview } from '../../shared/components/Telecallerleads/Tableview';
import { getallselectedteamleaderandtelecaller } from "../../shared/services/apiallocation/apiallocation";
import Tablepagination from "../../shared/components/others/Tablepagination";

export const TelecallerleadsPage = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(20);
    const [tabledata, setTabledata] = useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter] = useState('');
    const [filtervalues, setfiltervalues] = useState([]);
    let isMounted = true;

    const getallteamleaderandtelecaller= useCallback(async () => {
        const res = await getallselectedteamleaderandtelecaller({ first, rows, globalfilter, ...colfilter });
        setTabledata(res?.resdata);
        setTotalRecords(res?.totallength);
    }, [first, rows, globalfilter, colfilter]);

    useEffect(() => {
        if (isMounted) {
            getallteamleaderandtelecaller();
        }
        return () => isMounted = false;
    }, [first, rows, globalfilter, colfilter]);

    const cusfilter = (field, value) => {
        setcolFilter({ ...colfilter, ...{ [field]: value } });
    };
    const updateData = async () => {
        await getallteamleaderandtelecaller();
    };

    const onPage = (page) => {
        setPage(page)
        setFirst(rows * (page - 1));
        setRows(rows);
    };

    return (
        <div>
            <div>
                <Tableheadpanel />
                <Tableview
                    tabledata={tabledata}
                    filtervalues={filtervalues}
                    handlefiltervalue={cusfilter}
                    first={first}
                    setFirst={setFirst}
                    updateData={updateData}
                />
                <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />
            </div>
        </div>
    );
};
