import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import * as XLSX from 'xlsx';
import Tableview from "../../shared/components/Unallocation/Tableview";
import Tableheadpanel from "../../shared/components/Unallocation/Tableheadpanel";
import UploadForm from "../../shared/components/Unallocation/Upload";
import { deleteAllAllocation, getallunallocation, savebulkallocation } from "../../shared/services/apiunallocation/apiunallocation";
import toast from "react-hot-toast";
import { deleteSingleAllocation } from "../../shared/services/apiallocation/apiallocation";

export default function UnallocationPage() {
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [visible, setVisible] = useState(false);
    const [formdata, setFormdata] = useState({});
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);

    const [tabledata, setTabledata] = useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter] = useState('');
    const [filtervalues, setfiltervalues] = useState([]);
    const [UploadVisible, setUploadVisible] = useState(false);
    const [File, setFile] = useState([]);
    const [productCounts, setProductCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    let isMounted = true;

    const getallallocations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getallunallocation({ first, rows, globalfilter, ...colfilter });
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);
            const counts = res?.resdata.reduce((acc, item) => {
                const product = item.Product;
                if (product === 'PL' || product === 'DL' || product === 'BL' || product === 'STPL') {
                    acc.ALL = (acc.ALL || 0) + 1;
                    acc[product] = (acc[product] || 0) + 1;
                }
                return acc;
            }, {});
            setProductCounts(counts);
        } finally {
            setIsLoading(false);
        }
    }, [first, rows, globalfilter, colfilter]);

    useEffect(() => {
        if (isMounted) {
            getallallocations();
        }
        return () => isMounted = false;
    }, [getallallocations]);

    const cusfilter = (field, value) => {
        setcolFilter(prev => ({ ...prev, [field]: value }));
        setFirst(0); // Reset to first page when applying a new filter
    };

    const updateTableData = async () => {
        await getallallocations();
    };

    const newform = () => {
        setFormdata({});
        setVisible(true);
    };

    const Uploadform = () => {
        setUploadVisible(true);
    };

    const editfrom = (data) => {
        setFormdata(data);
        setVisible(true);
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleDeleteAll = () => {
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

    const handleupload = (e) => {
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
    };

    const uploadfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await savebulkallocation(File);
            getallallocations();
            toast.success("File uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload file. Please try again.");
        } finally {
            setLoading(false);
            setUploadVisible(false);
        }
    };

    const handledelete = (id) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 ml-2 text-white p-2',
            rejectClassName: 'p-2 outline-none border-0',
            accept: async () => {
                await deleteSingleAllocation(id);
                toast.success("Successfully deleted");
                getallallocations();
            }
        });
    };

    return (
        <div>
            <div className="bg-white border rounded-2xl">
                <Tableheadpanel
                    newform={newform}
                    setglobalfilter={setglobalfilter}
                    Uploadform={Uploadform}
                    handleDeleteAll={handleDeleteAll}
                    tabledata={tabledata}
                    productCounts={productCounts}
                    updateTableData={updateTableData}
                    loading={loading}
                    setLoading={setLoading}
                    selectedRows={selectedRows}
                    loading1={loading1}
                />
                <Tableview
                    tabledata={tabledata}
                    totalRecords={totalRecords}
                    first={first}
                    rows={rows}
                    updateTableData={updateTableData}
                    onPageChange={onPageChange}
                    editfrom={editfrom}
                    cusfilter={cusfilter}
                    filtervalues={filtervalues}
                    handledelete={handledelete}
                    isLoading={isLoading}
                    selectedRows={selectedRows} // Pass the selected rows to Tableview
                    setSelectedRows={setSelectedRows} // Pass the setSelectedRows function to Tableview

                />
                <UploadForm
                    uploadfile={uploadfile}
                    handleupload={handleupload}
                    UploadVisible={UploadVisible}
                    setUploadVisible={setUploadVisible}
                    loading={loading}
                />
                <ConfirmDialog />
            </div>
        </div>
    );
}