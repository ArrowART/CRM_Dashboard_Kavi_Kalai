/* eslint-disable react/prop-types */
// import { useRef } from 'react';
import { Chart } from 'primereact/chart';
import useAuth from '../../services/store/useAuth';
// import CanvasJSReact from '@canvasjs/react-charts';

export default function Dashboard(props) {  

  const { userdetails } = useAuth();
  const { chartData, chartOptions, barchartData, barchartOptions, procuctsbarchartData, productsbarchartOptions,
    productivitybarchartData, productivitybarchartOptions, allocationchartData, allocationchartOptions } = props;

  // const pyramidChartRef = useRef(null);
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

  // var CanvasJS = CanvasJSReact.CanvasJS;
  // var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  var dataPoint;
  var total;
  const options = {
    animationEnabled: true,
    title: {
      text: "Recruitment Analysis - July 2016"
    },
    data: [{
      type: "funnel",
      indexLabel: "{label} - {y}",
      toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
      neckWidth: 20,
      neckHeight: 0,
      valueRepresents: "area",
      dataPoints: [
        { y: 265, label: "Applications" },
        { y: 134, label: "Interviewed" },
        { y: 48, label: "Assessment" },
        { y: 26, label: "Hired" }
      ]
    }]
  };

  // calculate percentage
  dataPoint = options.data[0].dataPoints;
  total = dataPoint[0].y;
  for (var i = 0; i < dataPoint.length; i++) {
    if (i === 0) {
      options.data[0].dataPoints[i].percentage = 100;
    } else {
      options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
    }
  }

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

        {/* <div className='bg-white rounded-xl shadow-small'>
          <CanvasJSChart options={options} onRef={ref => pyramidChartRef.current = ref} />
        </div> */}
      </div>
     
        
     
      
    </>
  );
}
