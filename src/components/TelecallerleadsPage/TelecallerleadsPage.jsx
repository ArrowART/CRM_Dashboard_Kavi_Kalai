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
    const [rows, setRows] = useState(20);
    const [tabledata, setTabledata] = useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter] = useState('');
    const [filtervalues, setfiltervalues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeButton, setActiveButton] = useState('Allocated Leads'); // Initialize the activeButton state
    let isMounted = true;

    const getallteamleaderandtelecaller= useCallback(async () => {
        const res = await getallselectedteamleaderandtelecaller({ first, rows, globalfilter, ...colfilter });
        setIsLoading(false);
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
        setPage(page);
        setFirst(rows * (page - 1));
        setRows(rows);
    };

    const handleButtonClick = (button) => {
        setActiveButton(button);
        let filter = '';
        switch (button) {
            case 'Non Workable Leads':
                filter = ['DNE', 'Not Int'];
                break;
            case 'Followups':
                filter = ['Followup', 'Future Followup'];
                break;
            case 'Lead Submitted':
                filter = ['Submit Lead', 'Lead Submitted','Lead Accepted','Lead Declined'];
                break;
            default:
                filter = [button];
        }
        updateDataWithFilter(filter);
    };

    const updateDataWithFilter = async (filter) => {
        try {
            const params = {
                first,
                rows,
                globalfilter,
                dispositionfilter: filter.join('|') // Joining multiple filters with a pipe character
            };
            const res = await getallselectedteamleaderandtelecaller(params);
            setIsLoading(false);
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch data');
        }
    };

    return (
        <div className="bg-white border rounded-2xl">
            <Tableheadpanel setglobalfilter={setglobalfilter} />
            <Tableview 
                tabledata={tabledata}
                filtervalues={filtervalues}
                handlefiltervalue={cusfilter}
                first={first}
                setFirst={setFirst}
                updateData={updateData}
                isLoading={isLoading}
                handleButtonClick={handleButtonClick} // Pass the handleButtonClick function
                activeButton={activeButton} // Pass the activeButton state
            />
            <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />
        </div>
    );
};
