/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { savetelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation';

export default function Tableheadpanel ( props ) {
    const { newform, setglobalfilter, teamLeaders, teleCallers } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [selectedTelecallers, setSelectedTelecallers] = useState([]);
    const [telecallerFilter, setTelecallerFilter] = useState('');

    const handleAllocate = () => {
        setShowModal(true);
    };
    const handleAllocateConfirm = async () => {
        try {
            const selectedTeamLeaderData = teamLeaders.find(
                (leader) => leader.User_Id === selectedTeamLeader
            );

            const formattedData = {
                teamleader: [
                    {
                        User_Id: selectedTeamLeader,
                        First_Name: selectedTeamLeaderData
                            ? selectedTeamLeaderData.First_Name
                            : '',
                    },
                ],
                telecaller: selectedTelecallers.map((userId) => {
                    const user = teleCallers.find((user) => user.User_Id === userId);
                    return {
                        User_Id: userId,
                        First_Name: user ? user.First_Name : '',
                    };
                }),
            };

            const response = await savetelecallerallocation(formattedData);
            console.log('Response:', response);
            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAllocateCancel = () => {
        setSelectedTeamLeader('');
        setSelectedTelecallers([]);
        setShowModal(false);
    };

    return (
        <div className="items-center justify-between px-6 py-4 space-y-3 lg:space-y-0 lg:flex">
            <div>
                <h2 className="mx-1 text-xl font-semibold text-gray-800">
                    Users
                </h2>
            </div>
            <div>
                <div className="inline-flex lg:gap-x-2 gap-x-3">
                    <input type="text" placeholder="Search..." className="px-4 py-2 border outline-none rounded-xl w-[200px] lg:w-[250px]" onChange={(e) => setglobalfilter(e.target.value)} />
                    <button onClick={newform} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                    <i className="fi fi-rr-add"></i> <span className="hidden md:block">Add New</span>
                    </button>
{/*                   
                    <button onClick={handleAllocate} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                        <span>Allocate</span>
                    </button> */}
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
                        <MultiSelect
                            id="telecallers"
                            value={selectedTelecallers}
                            onChange={(e) => setSelectedTelecallers(e.value)}
                            className="w-full border border-gray-300 rounded-md p-multiselect"
                            options={teleCallers.map(user => ({ label: `${user.First_Name} (${user.User_Id})`, value: user.User_Id }))}
                            filter={true}
                            filterValue={telecallerFilter}
                            onFilter={(e) => setTelecallerFilter(e.target.value)}
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