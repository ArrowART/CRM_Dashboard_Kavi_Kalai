/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import useAuth from '../../services/store/useAuth';
import { getalltelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation';
import { allocateteamleader } from '../../services/apiallocation/apiallocation';

export default function Tableheadpanel(props) {
    const { handleDeleteAll, Uploadform, setglobalfilter, tabledata, productCounts, updateTableData } = props;
    const [showModal, setShowModal] = useState(false);
    const [allocationType, setAllocationType] = useState('teamLeader');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [selectedTelecaller, setSelectedTelecaller] = useState('');
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [telecallers, setTelecallers] = useState([]);
    const { userdetails } = useAuth();
    const [productType, setProductType] = useState('ALL');
    const [allocationRange, setAllocationRange] = useState();
    const [allocationRange1, setAllocationRange1] = useState();

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleAllocateCancel = () => {
        setShowModal(false);
    };

    const handleAllocateConfirm = async () => {
        try {
            if (!tabledata || tabledata.length === 0) {
                console.error("Table data is not available.");
                return;
            }
            const allocatedData = tabledata.slice(allocationRange - 1, allocationRange1);
            if (!allocatedData || allocatedData.length === 0) {
                console.error("No data to allocate.");
                return;
            }
            await allocateteamleader({
                data: allocatedData,
                selectedTeamLeader,
                selectedTelecaller
            });
            console.log('Bulk allocation saved successfully.');
            updateTableData();
        } catch (error) {
            console.error('Error saving bulk allocation:', error);
        }
        setShowModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const telecallerAllocationData = await getalltelecallerallocation({});
                const allTeamLeaders = telecallerAllocationData.resdata.map(item => item.teamleader[0]);
                const allTelecallers = telecallerAllocationData.resdata.reduce((acc, curr) => acc.concat(curr.telecaller), []);
                setTeamLeaders(allTeamLeaders);
                setTelecallers(allTelecallers);
            } catch (error) {
                console.error("Error fetching telecaller allocation data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchTelecallers = async () => {
            try {
                if (selectedTeamLeader) {
                    const telecallerAllocationData = await getalltelecallerallocation({});
                    const teamLeader = telecallerAllocationData.resdata.find(item => item.teamleader[0].UserName === selectedTeamLeader);
                    if (teamLeader) {
                        const telecallersForSelectedTeamLeader = teamLeader.telecaller;
                        setTelecallers(telecallersForSelectedTeamLeader);
                    }
                }
            } catch (error) {
                console.error("Error fetching telecallers:", error);
            }
        };
        fetchTelecallers();
    }, [selectedTeamLeader]);

    return (
        <div className="flex items-center justify-between px-6 py-4 lg:space-y-0">
            <div>
                <h2 className="mx-1 text-xl font-semibold text-gray-800">Allocation</h2>
            </div>
                <div className="flex-none px-2 lg:flex lg:gap-x-2 gap-x-3">
                    <input type="input" placeholder="Search..." className="px-4 py-2  border outline-none rounded-xl w-[170px] lg:w-[250px] mr-2" onChange={(e) => setglobalfilter(e.target.value)} />
                    <div className="py-2">
                    {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
                        <button onClick={toggleModal} className="inline-flex items-center px-3 py-2 mr-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                            <i className="fi fi-rr-add"></i> <span className="hidden md:block">Allocate</span>
                        </button>
                    )}
                    {userdetails()?.Role === 'SuperAdmin' && (
                        <>
                            <button onClick={Uploadform} className="inline-flex items-center px-3 py-2 mr-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                                <i className="fi fi-rr-file-upload"></i> <span className="hidden md:block">Upload</span>
                            </button>

                            <button onClick={handleDeleteAll} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-lg gap-x-2 hover:bg-red-800">
                                <i className="fi fi-rr-trash"></i><span className="hidden md:block"> Delete All</span>
                            </button>
                        </>
                    )}
                    </div>
                </div>
            <Dialog header="Allocate Users" visible={showModal} onHide={() => setShowModal(false)} modal className="p-4 bg-white rounded-lg w-[600px]">
                <div className="p-fluid">
                    {userdetails()?.Role === 'TeamLeader' ? (
                        <div className="mb-4 p-field">
                            <label htmlFor="selectedTelecaller" className="block mb-1">Select Telecaller</label>
                            <select
                                id="selectedTelecaller"
                                value={selectedTelecaller}
                                onChange={(e) => setSelectedTelecaller(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                            >
                                <option value="">Select a Telecaller</option>
                                {telecallers.map((user) => (
                                    <option key={user.UserName} value={user.UserName}>
                                        {user.First_Name} ({user.UserName})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 p-field">
                                <label htmlFor="allocationType" className="block mb-1">Allocate To</label>
                                <select
                                    id="allocationType"
                                    value={allocationType}
                                    onChange={(e) => setAllocationType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                                >
                                    <option value="teamLeader">Team Leader</option>
                                    <option value="telecaller">Telecaller</option>
                                </select>
                            </div>
                            {allocationType === 'teamLeader' ? (
                                <div className="mb-4 p-field">
                                    <label htmlFor="selectedTeamLeader" className="block mb-1">Select Team Leader</label>
                                    <select
                                        id="selectedTeamLeader"
                                        value={selectedTeamLeader}
                                        onChange={(e) => setSelectedTeamLeader(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                                    >
                                        <option value="">Select a Team Leader</option>
                                        {teamLeaders.map((user) => (
                                            <option key={user.UserName} value={user.UserName}>
                                                {user.First_Name} ({user.UserName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="mb-4 p-field">
                                    <label htmlFor="selectedTelecaller" className="block mb-1">Select Telecaller</label>
                                    <select
                                        id="selectedTelecaller"
                                        value={selectedTelecaller}
                                        onChange={(e) => setSelectedTelecaller(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                                    >
                                        <option value="">Select a Telecaller</option>
                                        {telecallers.map((user) => (
                                            <option key={user.UserName} value={user.UserName}>
                                                {user.First_Name} ({user.UserName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                    {/* <div className="mb-4 p-field">
                        <label htmlFor="productType" className="block mb-1">Product Type</label>
                        <select
                            id="productType"
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                        >
                            <option value="ALL">ALL ({productCounts.ALL || 0})</option>
                            <option value="PL">PL ({productCounts.PL || 0})</option>
                            <option value="DL">DL ({productCounts.DL || 0})</option>
                            <option value="BL">BL ({productCounts.BL || 0})</option>
                            <option value="STPL">STPL ({productCounts.STPL || 0})</option>
                        </select>
                    </div> */}
                    <div className="mb-4 p-field">
                        <label htmlFor="From" className="block mb-1">From</label>
                        <input
                            type="number"
                            id="allocationRange"
                            value={allocationRange}
                            onChange={(e) => {
                                console.log('Allocation Range changed:', e.target.value);
                                setAllocationRange(e.target.value);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                            min="1"
                        />
                    </div>
                    <div className="mb-4 p-field">
                        <label htmlFor="To" className="block mb-1">To</label>
                        <input
                            type="number"
                            id="allocationRange1"
                            value={allocationRange1}
                            onChange={(e) => {
                                console.log('Allocation Range 1 changed:', e.target.value);
                                setAllocationRange1(e.target.value);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                            min="0"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button label="Cancel" className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600" onClick={handleAllocateCancel} />
                    <Button label="Allocate" className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600" onClick={handleAllocateConfirm} autoFocus />
                </div>
            </Dialog>
        </div>
    );
}
