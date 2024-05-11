/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { getallusers } from '../../services/apiusers/apiusers';
import { allocateteamleader } from '../../services/apiallocation/apiallocation';

export default function Tableheadpanel(props) {
    const { handleDeleteAll, Uploadform, setglobalfilter, tabledata,productCounts,updateTableData } = props;
    const [showModal, setShowModal] = useState(false);
    const [allocationType, setAllocationType] = useState('teamLeader');
    const [selectedUser, setSelectedUser] = useState('');
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [telecallers, setTelecallers] = useState([]);
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
                selectedTeamLeader: selectedUser 
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
                const userData = await getallusers({});
                const allTeamLeaders = userData.resdata.filter(user => user.Role === 'TeamLeader');
                const allTelecallers = userData.resdata.filter(user => user.Role === 'Telecaller');
                const filteredData = userData.resdata.filter(user => !user.selectedTeamLeader);
                setTeamLeaders(allTeamLeaders);
                setTelecallers(allTelecallers);
                setTabledata(filteredData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="items-center justify-between px-6 py-4 space-y-3 lg:space-y-0 lg:flex">
            <div>
                <h2 className="mx-1 text-xl font-semibold text-gray-800">Allocation</h2>
            </div>

            <div>
                <div className="inline-flex lg:gap-x-2 gap-x-3">
                    <input type="input" placeholder="Search..." className="px-4 py-2 border outline-none rounded-xl w-[200px] md:w-[250px]" onChange={(e) => setglobalfilter(e.target.value)} />

                    <button onClick={Uploadform} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                        <i className="fi fi-rr-file-upload"></i> <span className="hidden md:block">Upload</span>
                    </button>
                    <button onClick={toggleModal} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                        <i className="fi fi-rr-add"></i> <span className="hidden md:block">Allocate</span>
                    </button>
                    <button onClick={handleDeleteAll} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-lg gap-x-2 hover:bg-red-800">
                        <i className="fi fi-rr-trash"></i> Delete All
                    </button>
                </div>
            </div>
            {/* Modal for allocation */}
            <Dialog header="Allocate Users" visible={showModal} onHide={() => setShowModal(false)} modal style={{ width: '30vw' }} className="p-4 bg-white rounded-lg">
                <div className="p-fluid">
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
                        <label htmlFor="selectedUser" className="block mb-1">{allocationType === 'teamLeader' ? 'Select Team Leader' : 'Select Telecaller'}</label>
                        <select
                            id="selectedUser"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                        >
                            <option value="">Select {allocationType === 'teamLeader' ? 'a TeamLeader' : 'a Telecaller'}</option>
                            {allocationType === 'teamLeader' ? (
                                teamLeaders.map((user) => (
                                    <option key={user.UserName} value={user.UserName}>
                                        {user.First_Name} ({user.UserName})
                                    </option>
                                ))
                            ) : (
                                telecallers.map((user) => (
                                    <option key={user.UserName} value={user.UserName}>
                                        {user.First_Name} ({user.UserName})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="mb-4 p-field">
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
                    </div>
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
