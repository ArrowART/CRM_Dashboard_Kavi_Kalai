/* eslint-disable react/prop-types */
// import { useRef } from 'react';
import { Chart } from 'primereact/chart';
import useAuth from '../../services/store/useAuth';
import ApexCharts from 'apexcharts';
import { useEffect } from 'react';

export default function Dashboard(props) {  

  const { userdetails } = useAuth();
  const { chartData, chartOptions, barchartData, barchartOptions, procuctsbarchartData, productsbarchartOptions,
    productivitybarchartData, productivitybarchartOptions, allocationchartData, allocationchartOptions } = props;

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  useEffect(() => {

  const getChartOptions = () => {
    return {
      series: [35.1, 23.5, 2.4, 5.4],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Unique visitors",
                fontFamily: "Inter, sans-serif",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return '$' + sum + 'k'
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return value + "k"
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "k"
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value  + "k"
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }
  }
  
  if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
    chart.render(); 
  }
}, []);
  

  return (
    <>
      <div className='grid justify-center grid-cols-1 mb-5 shadow-xl'>
        <div className='bg-white rounded-xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            <div className='flex items-center justify-center p-2'>
              <p className='text-2xl font-medium lg:text-4xl text-slate-600'>{getGreeting()}  {userdetails()?.Role},</p>
            </div>
            <div className='flex items-center justify-center p-2'>
              <img 
                src="/images/call-center.png" 
                alt="" 
                className='object-cover w-full max-w-[200px] h-auto max-h-[340px] -my-9' 
              />
            </div>
          </div>
        </div>
      </div>
      {(userdetails()?.Role === "Telecaller") && (
        <div className='bg-white rounded-xl '>
          <div className="p-5">
            <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Telecaller Leads</h1>
            <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
          </div>
        </div>
      )}
      <div className="grid justify-center lg:h-[430px] grid-cols-1 gap-8 lg:grid-cols-3">
        {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
          <div className='bg-white rounded-xl shadow-small'>
            <div className="flex justify-center ">
              <div className="p-5 lg:h-[90px] lg:w-[350px]">
                <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Total Users</h1>
                <Chart type="doughnut" data={chartData} options={chartOptions} className="" />
              </div>
            </div>
          </div>
        )}
        {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
          <div className='bg-white rounded-xl shadow-small'>
            <div className="flex justify-center rounded-xl">
              <div className="p-5 lg:h-[220px] lg:w-[370px]">
                <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Productivity Data</h1>
                <Chart type="doughnut" data={productivitybarchartData} options={productivitybarchartOptions} className="" />
              </div>
            </div>
          </div>
        )}
        {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
          <div className='bg-white rounded-xl shadow-small'>
            <div className="flex justify-center">
              <div className="p-5 lg:h-[90px] lg:w-[350px]">
                <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Allocated and Unallocated</h1>
                <Chart type="doughnut" data={allocationchartData} options={allocationchartOptions} className="" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid justify-center grid-cols-1 gap-8 mt-5 lg:grid-cols-2">
        {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
          <div className='bg-white rounded-xl shadow-small'>
            <div className="p-5">
              <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Telecaller Leads</h1>
              <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
            </div>
          </div>
        )}
        {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
          <div className='bg-white rounded-xl shadow-small'>
            <div className="p-5">
              <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Products Count</h1>
              <Chart type="bar" data={procuctsbarchartData} options={productsbarchartOptions} className="" />
            </div>
          </div>
        )}

        
     
      </div>
      {/* <div className="w-full max-w-sm p-4 mt-5 bg-white rounded-lg shadow dark:bg-gray-800 md:p-6">
        <div className="flex items-center justify-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Website traffic</h5>
        </div>
        <div className="py-6" id="donut-chart"></div>
      </div> */}
      
    </>
  );
}
