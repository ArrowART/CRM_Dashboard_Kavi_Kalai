import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Tableheadpanel from '../../shared/components/Telecallerleads/Tableheadpanel';
import { Tableview } from '../../shared/components/Telecallerleads/Tableview';
import { getallselectedteamleaderandtelecaller } from "../../shared/services/apiallocation/apiallocation";

export const TelecallerleadsPage = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
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
    return (
        <div>
            <div>
                <Tableheadpanel />
                <Tableview
                    tabledata={tabledata}
                    totalRecords={totalRecords}
                    first={first}
                    cusfilter={cusfilter}
                    filtervalues={filtervalues}
                />
            </div>
        </div>
    );
};
