import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { getallusers } from '../../services/apiusers/apiusers';
import { getallselectedteamleaderandtelecaller } from '../../services/apiallocation/apiallocation';

export default function Dashboard() {
  const [chartData, setChartData] = useState({});
  const [barchartData, setBarChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [barchartOptions, setBarChartOptions] = useState({});
  const [productivitybarchartData, setProductivityBarChartData] = useState({});
  const [productivitybarchartOptions, setProductivityBarChartOptions] = useState({});

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

  // Productivity Data Chart
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const fetchProductivityData = async () => {
      try {
        const backendResponse1 = await getallselectedteamleaderandtelecaller();

        if (Array.isArray(backendResponse1.resdata)) {
          const productivityStatusCount = backendResponse1.resdata.reduce((acc, curr) => {
            const productivityStatus = curr.Productivity_Status;
            if (productivityStatus === 'Worked Leads') {
              acc.WorkedLeads++;
            } else if (productivityStatus === 'Reached') {
              acc.Reached++;
            } else if (productivityStatus === 'Not Reached') {
              acc.NonReached++;
            } else if (productivityStatus === 'Lead Accepted') {
              acc.LeadAccepted++;
            } else if (productivityStatus === 'Not Updated') {
              acc.NotUpdated++;
            }
            return acc;
          }, { WorkedLeads: 0, Reached: 0, NonReached: 0, LeadAccepted: 0, NotUpdated: 0 });

          const data = {
            labels: ['Worked Leads', 'Reached', 'Not Reached', 'Lead Accepted', 'Not Updated'],
            datasets: [
              {
                label: 'Productivity',
                backgroundColor: [
                  documentStyle.getPropertyValue('--blue-500'),
                  documentStyle.getPropertyValue('--yellow-500'),
                  documentStyle.getPropertyValue('--red-500'),
                  documentStyle.getPropertyValue('--orange-500'),
                  documentStyle.getPropertyValue('--green-500'),
                ],
                data: [
                  productivityStatusCount.WorkedLeads,
                  productivityStatusCount.Reached,
                  productivityStatusCount.NonReached,
                  productivityStatusCount.LeadAccepted,
                  productivityStatusCount.NotUpdated
                ]
              }
            ]
          };

          const options = {
            cutout: '60%'
        };

            setProductivityBarChartData(data);
          setProductivityBarChartOptions(options);
        } else {
          console.error('Backend data is not an array:', backendResponse1.resdata);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductivityData();
  }, []);

  return (
    <div className="grid justify-center grid-cols-1 lg:grid-cols-2">
      <div className="p-5 lg:h-[200px] lg:w-[400px]">
        <h1 className="text-2xl font-semibold">Total Users</h1>
        <Chart type="pie" data={chartData} options={chartOptions} className="" />
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">Telecaller Leads</h1>
        <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
      </div>
      <div className="p-5 lg:h-[300px] lg:w-[450px]">
        <h1 className="text-2xl font-semibold">Productivity Data</h1>
        <Chart type="doughnut" data={productivitybarchartData} options={productivitybarchartOptions} className="" />
      </div>
    </div>
  );
}
