import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { getallusers } from '../../services/apiusers/apiusers';

export default function Dashboard() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

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

  return (
    <div className="flex card justify-content-center">
      <div className="p-5" style={{ width: '400px', height: '300px' }}>
        <h1 className='text-2xl font-semibold'>Total Users</h1>
        <Chart type="pie" data={chartData} options={chartOptions} className=""/>
      </div>

    </div>
  );
}
