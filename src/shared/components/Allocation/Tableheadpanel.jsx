import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function Tableheadpanel(props) {
    const { handleDeleteAll, Uploadform, setglobalfilter } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [teamLeaders, setTeamLeaders] = useState([]); // Assuming you have state for teamLeaders
    const [teleCallers, setTeleCallers] = useState([]); // Assuming you have state for teleCallers
    const [telecallersForSelectedLeader, setTelecallersForSelectedLeader] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    // Function to handle modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Function to handle allocation cancel
    const handleAllocateCancel = () => {
        setShowModal(false);
        // Reset any state if needed
    };

    // Function to handle allocation confirmation
    const handleAllocateConfirm = () => {
        // Perform allocation logic here
        setShowModal(false);
        // Reset any state if needed
    };

    // Effect to update telecallers when selectedTeamLeader changes
    useEffect(() => {
        if (selectedTeamLeader) {
            // Filter telecallers for the selected team leader
            const telecallers = teamLeaders.find(leader => leader.User_Id === selectedTeamLeader)?.Telecallers || [];
            setTelecallersForSelectedLeader(telecallers);
        } else {
            setTelecallersForSelectedLeader([]);
        }
    }, [selectedTeamLeader, teamLeaders]);

    return (
        <div className="items-center justify-between px-6 py-4 space-y-3 lg:space-y-0 lg:flex">
            <div>
                <h2 className="mx-1 text-xl font-semibold text-gray-800">
                    Allocation
                </h2>
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
                        <label htmlFor="teamLeader" className="block mb-1">Select Team Leader</label>
                        <select id="teamLeader" value={selectedTeamLeader} onChange={(e) => setSelectedTeamLeader(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component">
                            <option value="">Select a Team Leader</option>
                            {teamLeaders.map(user => (
                                <option key={user.User_Id} value={user.User_Id}>{user.First_Name} ({user.User_Id})</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 p-field">
                        <label htmlFor="telecallers" className="block mb-1">Select Telecallers</label>
                        <select id="telecallers" value={telecallersForSelectedLeader} onChange={(e) => setTelecallersForSelectedLeader(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component">
                            <option value="">Select a Telecaller</option>
                            {telecallersForSelectedLeader.map(telecaller => (
                                <option key={telecaller.User_Id} value={telecaller.User_Id}>{telecaller.First_Name} ({telecaller.User_Id})</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 p-field">
                        <label htmlFor="from" className="block mb-1">From</label>
                        <input type="text" id="from" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" />
                    </div>
                    <div className="mb-4 p-field">
                        <label htmlFor="to" className="block mb-1">To</label>
                        <input type="text" id="to" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" />
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
