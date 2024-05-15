/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { savetelecallerallocation, updatetelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation'; 
import toast from 'react-hot-toast';

export const Tableheadpanel = ({ setglobalfilter, teamLeaders, teleCallers, setTelecallerData, telecallerData, visible, setVisible, formdata, setFormdata }) => {
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [selectedTelecallers, setSelectedTelecallers] = useState([]);
    const [telecallerFilter, setTelecallerFilter] = useState('');

    useEffect(() => {
        if (visible) {
            if (formdata.teamleader) {
                setSelectedTeamLeader(formdata.teamleader[0].UserName);
            }
            if (formdata.telecaller) {
                setSelectedTelecallers(formdata.telecaller.map(caller => caller.UserName));
            }
        }
    }, [visible, formdata]);

    const handleAllocate = () => {
        setFormdata({});
        setSelectedTeamLeader('');
        setSelectedTelecallers([]);
        setVisible(true);
    };

    const handleAllocateConfirm = async () => {
        try {
            const selectedTeamLeaderData = teamLeaders.find(
                (leader) => leader.UserName === selectedTeamLeader
            );
            const formattedData = {
                teamleader: [
                    {
                        UserName: selectedTeamLeader,
                        First_Name: selectedTeamLeaderData ? selectedTeamLeaderData.First_Name : '',
                    },
                ],
                telecaller: selectedTelecallers.map((UserName) => {
                    const user = teleCallers.find((user) => user.UserName === UserName);
                    return {
                        UserName: UserName,
                        First_Name: user ? user.First_Name : '',
                    };
                }),
            };
            let response;
            if (formdata._id) {
                response = await updatetelecallerallocation(formdata._id, formattedData);
                const updatedData = telecallerData.map(data => 
                  data._id === formdata._id ? response : data
                );
                setTelecallerData(updatedData);
            } else {
                response = await savetelecallerallocation(formattedData);
                setTelecallerData([...telecallerData, response]);
            }
            toast.success("Team Members allocated successfully!");
            setVisible(false);
            setFormdata({});
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error in allocating team members");
        }
    };
    

    const handleAllocateCancel = () => {
        setSelectedTeamLeader('');
        setSelectedTelecallers([]);
        setVisible(false);
    };

    const handleFilterChange = (event) => {
        setglobalfilter(event.target.value);
    };

    const filteredTeamLeaders = useMemo(() => {
        return teamLeaders.filter((leader) => {
            if (telecallerData && telecallerData.length > 0) {
                return !telecallerData?.some((data) => data.teamleader && data.teamleader.length > 0 && data.teamleader[0].UserName === leader.UserName);
            }
            return true;
        });
    }, [teamLeaders, telecallerData]);
    

    const filteredTeleCallers = useMemo(() => {
        return teleCallers.filter((telecaller) => {
            return !telecallerData.some((data) => data.telecaller?.some((caller) => caller.UserName === telecaller.UserName));
        });
    }, [teleCallers, telecallerData]);

    return (
        <div className="flex justify-between px-6 py-4 space-y-3 lg:space-y-0 lg:flex">
            <div>
                <h2 className="mx-1 text-xl font-semibold text-gray-800">
                    Team Allocation
                </h2>
            </div>
            <div>
                <div className="inline-flex lg:gap-x-2 gap-x-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-4 py-2 border outline-none rounded-xl"
                        onChange={handleFilterChange}
                    />
                    <button
                        onClick={handleAllocate}
                        className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <span>Allocate</span>
                    </button>
                </div>
            </div>
            <Dialog
                header="Allocate Team Members"
                visible={visible}
                onHide={() => setVisible(false)}
                modal
                style={{ width: '30vw' }}
                className="p-4 bg-white rounded-lg"
            >
                <div className="p-fluid">
                    <div className="mb-4 p-field">
                        <label htmlFor="teamLeader" className="block mb-1">
                            Select Team Leader
                        </label>
                        <select
                            id="teamLeader"
                            value={selectedTeamLeader}
                            onChange={(e) => setSelectedTeamLeader(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component"
                        >
                            <option value="">Select a Team Leader</option>
                            {filteredTeamLeaders.map((user) => (
                                <option key={user.UserName} value={user.UserName}>
                                    {user.First_Name} ({user.UserName})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 p-field">
                        <label htmlFor="telecallers" className="block mb-1">
                            Select Telecallers
                        </label>
                        <MultiSelect
                            id="telecallers"
                            value={selectedTelecallers}
                            onChange={(e) => setSelectedTelecallers(e.value)}
                            className="w-full border border-gray-300 rounded-md p-multiselect"
                            options={filteredTeleCallers.map((user) => ({
                                label: `${user.First_Name} (${user.UserName})`,
                                value: user.UserName,
                            }))}
                            filter
                            filterValue={telecallerFilter}
                            onFilter={(e) => setTelecallerFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button
                        label="Cancel"
                        className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600"
                        onClick={handleAllocateCancel}
                    />
                    <Button
                        label="Allocate"
                        className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600"
                        onClick={handleAllocateConfirm}
                        autoFocus
                    />
                </div>
            </Dialog>
        </div>
    );
};
