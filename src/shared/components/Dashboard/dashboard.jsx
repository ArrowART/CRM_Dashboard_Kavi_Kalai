/* eslint-disable react/prop-types */
import { Chart } from 'primereact/chart';
import useAuth from '../../services/store/useAuth';

export default function Dashboard(props) {  

  const { userdetails} = useAuth()
  const {chartData,chartOptions,barchartData,barchartOptions,procuctsbarchartData,productsbarchartOptions
    ,productivitybarchartData,productivitybarchartOptions,allocationchartData,allocationchartOptions}=props;

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

    return (
      <>
<div className='grid justify-center grid-cols-1 mb-5'>
  <div className='bg-white rounded-xl'>
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      <div className='flex items-center justify-center p-2'>
        <p className='text-2xl font-medium lg:text-5xl text-slate-600'>{getGreeting()}  {userdetails()?.Role},</p>
      </div>
      <div className='flex items-center justify-center p-2'>
        <img 
          src="/images/call-center.png" 
          alt="" 
          className='object-cover w-full max-w-[430px] h-auto max-h-[340px] -my-6' 
        />
      </div>
    </div>
  </div>
</div>
    {(userdetails()?.Role === "Telecaller") && (
      <div className='bg-white rounded-xl '>
        <div className="p-5">
          <h1 className="p-1 text-xl font-semibold text-white bg-purple-400 rounded-lg w-fit">Telecaller Leads</h1>
          <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
        </div>
        </div>
    )}
    <div className="grid justify-center lg:h-[430px] grid-cols-1 gap-5 lg:grid-cols-3">
    {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
      <div className='bg-white rounded-xl '>
      <div className="flex justify-center rounded-xl">
      <div className="p-5 lg:h-[100px] lg:w-[360px]">
        <h1 className="p-1 text-xl font-semibold text-white bg-purple-400 rounded-lg w-fit">Total Users</h1>
        <Chart type="pie" data={chartData} options={chartOptions} className="" />
      </div>
      </div>
      </div>
    )}
   {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
      <div className='bg-white rounded-xl '>
      <div className="flex justify-center rounded-xl">
      <div className="p-5 lg:h-[230px] lg:w-[380px]">
        <h1 className="p-1 text-xl font-semibold text-white bg-purple-400 rounded-lg w-fit">Productivity Data</h1>
        <Chart type="doughnut" data={productivitybarchartData} options={productivitybarchartOptions} className="" />
      </div>
      </div>
      </div>
   )}
  
  {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
      <div className='bg-white rounded-xl '>
      <div className="flex justify-center rounded-xl ">
      <div className="p-5 lg:h-[100px] lg:w-[360px]">
        <h1 className="p-1 text-xl font-semibold text-white bg-purple-400 rounded-lg w-fit">Allocated and Unallocated</h1>
        <Chart type="pie" data={allocationchartData} options={allocationchartOptions} className="" />
      </div>
      </div>
      </div>
  )}
      </div>

      <div className="grid justify-center grid-cols-1 gap-3 mt-5 lg:grid-cols-2">
      {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
      <div className='bg-white rounded-xl '>
      <div className="p-5">
        <h1 className="p-1 text-xl font-semibold text-white bg-purple-400 rounded-lg w-fit">Telecaller Leads</h1>
        <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
      </div>
      </div>
      )}

      {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
      <div className='bg-white rounded-xl '>
      <div className="p-5">
        <h1 className="p-1 text-xl font-semibold text-white bg-purple-400 rounded-lg w-fit">Products Count</h1>
        <Chart type="bar" data={procuctsbarchartData} options={productsbarchartOptions} className="" />
      </div>
      </div>
      )}
      
      </div>

      
      </>
  );
}
