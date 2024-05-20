import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { getallusers } from '../../services/apiusers/apiusers';
import { getallselectedteamleaderandtelecaller } from '../../services/apiallocation/apiallocation';

export default function Dashboard() {
  const [chartData, setChartData] = useState({});
  const [barchartData, setBarChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [barchartOptions, setBarChartOptions] = useState({});
  
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);

    const fetchData = async () => {
      try {
        const backendResponse = await getallusers();
        
        if (Array.isArray(backendResponse.resdata)) {
          const roleCount = backendResponse.resdata.reduce((acc, curr) => {
            const role = curr.Role;
            if (role === 'TeamLeader') {
              acc.TeamLeader++;
            } else if (role === 'Telecaller') {
              acc.Telecaller++;
            }
            return acc;
          }, { TeamLeader: 0, Telecaller: 0 });

          const data = {
            labels: ['TeamLeader', 'Telecaller'],
            datasets: [
              {
                data: [roleCount.TeamLeader, roleCount.Telecaller],
                backgroundColor: [
                  documentStyle.getPropertyValue('--blue-500'),
                  documentStyle.getPropertyValue('--yellow-500'),
                ],
                hoverBackgroundColor: [
                  documentStyle.getPropertyValue('--blue-400'),
                  documentStyle.getPropertyValue('--yellow-400'),
                ]
              }
            ]
          };

          const options = {
            plugins: {
              legend: {
                labels: {
                  usePointStyle: true
                }
              }
            }
          };

          setChartData(data);
          setChartOptions(options);
        } else {
          console.error('Backend data is not an array:', backendResponse.resdata);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Bar chart
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const fetchLeadsData = async () => {
      try {
        const backendResponse = await getallselectedteamleaderandtelecaller();
        
        if (Array.isArray(backendResponse.resdata)) {
          const dispositionCount = backendResponse.resdata.reduce((acc, curr) => {
            const dispositionMatch = curr.Disposition.match(/(.*?)(?:\s\()/);
            const Disposition = dispositionMatch ? dispositionMatch[1] : 'undefined';
            if (Disposition === 'totallength') {
              acc.AllocatedLeads++;
            } else if (Disposition === 'Call Back') {
              acc.WorkableLeads++;
            } else if (Disposition === 'Not Int') {
              acc.NonWorkableLeads++;
            } else if (Disposition === 'Followup') {
              acc.Followups++;
            } else if (Disposition === 'Submit Lead') {
              acc.LeadSubmitted++;
            }
            return acc;
          }, { AllocatedLeads: 0, WorkableLeads: 0, NonWorkableLeads: 0, Followups: 0, LeadSubmitted: 0 });

          const data = {
            labels: ['Allocated Leads', 'Workable Leads', 'Non-Workable Leads', 'Followup', 'Lead Submitted'],
            datasets: [
              {
                label: 'Leads',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--yellow-400'),
                data: [
                  dispositionCount.AllocatedLeads,
                  dispositionCount.WorkableLeads,
                  dispositionCount.NonWorkableLeads,
                  dispositionCount.Followups,
                  dispositionCount.LeadSubmitted
                ]
              }
            ]
          };

          const options = {
            plugins: { legend: { display: true }
            },
            scales: {
              x: {
                display: true,
                title: { display: true, text: 'Lead Status' }},
              y: {
                display: true,
                title: { display: true, text: 'Count' }}
            }
          };

          setBarChartData(data);
          setBarChartOptions(options);
        } else {
          console.error('Backend data is not an array:', backendResponse.resdata);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLeadsData();
  }, []);

  return (
    <div className="grid justify-center grid-cols-1 lg:grid-cols-2">
      <div className="p-5  lg:h-[200px] lg:w-[400px]">
        <h1 className='text-2xl font-semibold'>Total Users</h1>
        <Chart type="pie" data={chartData} options={chartOptions} className=""/>
      </div>
      <div className="p-5">
        <h1 className='text-2xl font-semibold'>Telecaller Leads</h1>
        <Chart type="bar" data={barchartData} options={barchartOptions} className=""/>
      </div>
    </div>
  );
}
