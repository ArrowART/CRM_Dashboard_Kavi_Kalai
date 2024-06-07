/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import useAuth from '../../services/store/useAuth';
import { getalltelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation';
import { allocateteamleader } from '../../services/apiunallocation/apiunallocation';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';

export default function Tableheadpanel(props) {
    const { handleDeleteAll, Uploadform, setglobalfilter, tabledata, updateTableData, loading, setLoading, selectedRows } = props;
    const [showModal, setShowModal] = useState(false);
    const [allocationType, setAllocationType] = useState('teamLeader');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [selectedTelecaller, setSelectedTelecaller] = useState('');
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [telecallers, setTelecallers] = useState([]);
    const { userdetails } = useAuth();
    const isMounted = useRef(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleAllocateCancel = () => {
        setShowModal(false);
    };

    const handleAllocateConfirm = async () => {
        setLoading(true);
        try {
            if (!selectedRows || selectedRows.length === 0) {
                console.error("No data selected to allocate.");
                setLoading(false);
                return;
            }
            await allocateteamleader({
                data: selectedRows,
                selectedTeamLeader,
                selectedTelecaller
            });
            console.log('Bulk allocation saved successfully.');
            updateTableData();
            toast.success("Allocation completed successfully!", {
                duration: 4000,
            });
        } catch (error) {
            console.error('Error saving bulk allocation:', error);
            toast.error("Failed to complete allocation. Please try again.");
        }
        setLoading(false);
        setShowModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const telecallerAllocationData = await getalltelecallerallocation({});
                const allTeamLeaders = telecallerAllocationData.resdata.map(item => item.teamleader[0]);
                const allTelecallers = telecallerAllocationData.resdata.reduce((acc, curr) => acc.concat(curr.telecaller), []);
                if (isMounted.current) {
                    setTeamLeaders(allTeamLeaders);
                    setTelecallers(allTelecallers);

                    // Set the selectedTeamLeader value based on the user's role
                    if (userdetails()?.Role === 'TeamLeader') {
                        const currentUser = allTeamLeaders.find(user => user.UserName === userdetails().UserName);
                        setSelectedTeamLeader(currentUser?.UserName || '');
                    }
                }
            } catch (error) {
                console.error("Error fetching telecaller allocation data:", error);
            }
        };

        if (!isMounted.current) {
            isMounted.current = true;
            fetchData();
        }
    }, []);

    useEffect(() => {
        const fetchTelecallers = async () => {
            try {
                if (selectedTeamLeader) {
                    const telecallerAllocationData = await getalltelecallerallocation({});
                    const teamLeader = telecallerAllocationData.resdata.find(item => item.teamleader[0].UserName === selectedTeamLeader);
                    if (teamLeader && isMounted.current) {
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
            <div className='flex py-2'>
                <h2 className="mx-1 text-xl font-semibold text-gray-800">Unallocation Data</h2>
                <div className='flex gap-2 mx-5'>
                <NavLink
                        to={"/unallocation"}
                        isActive={(match, location) => {
                            if (location.pathname === '/unallocation' || location.pathname === '/') {
                                return true;
                            }
                            return false;
                        }}
                        className={({ isActive }) =>
                            `flex items-center font-semibold py-2 px-2.5 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600"
                            } text-sm text-white  rounded-lg `
                        }
                    >
                        UnAllocated
                    </NavLink>
                    <NavLink
                        to={"/allocation"}
                        isActive={(match, location) => {
                            if (location.pathname === '/allocation') {
                                return true;
                            }
                            return false;
                        }}
                        className={({ isActive }) =>
                            `flex items-center font-semibold gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600"
                            } text-sm text-white  rounded-lg  `
                        }
                    >
                        Allocated
                    </NavLink>
                    </div>
            </div>
            <div className="flex-none px-2 lg:flex lg:gap-x-2 gap-x-3">
                <div className="flex gap-2 py-2">
            
                    {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
                        <button onClick={toggleModal} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-lg bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                            <i className="fi fi-rr-add"></i> <span className="hidden md:block">Allocate</span>
                        </button>
                    )}
                    {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
                        <>
                            {loading && <span className="inline-block w-4 h-4 mr-2 text-blue-500 border-2 border-current rounded-full animate-spin border-t-transparent" aria-label="loading"></span>}
                            <button onClick={Uploadform} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-lg bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                                <i className="fi fi-rr-file-upload"></i> <span className="hidden md:block">Upload</span>
                            </button>
                            {userdetails()?.Role === 'SuperAdmin' && (
                                <button onClick={handleDeleteAll} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-lg bg-gradient-to-b from-red-400 to-red-600 gap-x-2 hover:bg-red-800">
                                    <i className="fi fi-rr-trash"></i><span className="hidden md:block"> Delete All</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
                <div className='py-2'>
                    <input type="input" placeholder="Search..." className="px-4 py-2 border outline-none rounded-xl w-[170px] lg:w-[250px] mr-2" onChange={(e) => setglobalfilter(e.target.value)} />
                </div>
            </div>
            <Dialog header="Allocate Users" visible={showModal} onHide={() => setShowModal(false)} modal className="p-4 bg-white rounded-lg w-[600px]">
                <div className="p-fluid">
                    {(userdetails()?.Role === 'SuperAdmin') && (
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
                            {allocationType === 'telecaller' && (
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
                    {(userdetails()?.Role === 'TeamLeader') && (
                        <>
                            <div className="mb-4 p-field">
                                <label htmlFor="allocationType" className="block mb-1">Allocate To</label>
                                <select
                                    id="allocationType"
                                    value={allocationType}
                                    onChange={(e) => setAllocationType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                                >
                                    <option value="telecaller">Telecaller</option>
                                </select>
                            </div>
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
                        </>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <Button label="Cancel" className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600" onClick={handleAllocateCancel} />
                    {loading && <span className="inline-block w-4 h-4 mr-2 text-blue-500 border-2 border-current rounded-full animate-spin border-t-transparent" aria-label="loading"></span>}
                    <Button label="Allocate" className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600" onClick={handleAllocateConfirm} autoFocus disabled={loading} />
                </div>
            </Dialog>
        </div>
    );
}
