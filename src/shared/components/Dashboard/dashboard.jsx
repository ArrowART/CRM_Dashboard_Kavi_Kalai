/* eslint-disable react/prop-types */
import { Chart } from 'primereact/chart';

export default function Dashboard(props) {

  const {chartData,chartOptions,barchartData,barchartOptions,procuctsbarchartData,productsbarchartOptions
    ,productivitybarchartData,productivitybarchartOptions,allocationchartData,allocationchartOptions}=props;

    return (
      <>
    <div className="grid justify-center h-[450px] grid-cols-1 gap-3 lg:grid-cols-3">
      <div className='transition-transform duration-300 ease-in-out bg-white shadow-md rounded-xl hover:scale-105'>
      <div className="flex justify-center rounded-xl">
      <div className="p-5 lg:h-[120px] lg:w-[380px]">
        <h1 className="p-2 text-xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Total Users</h1>
        <Chart type="pie" data={chartData} options={chartOptions} className="" />
      </div>
      </div>
      </div>

      <div className='transition-transform duration-300 ease-in-out bg-white shadow-md rounded-xl hover:scale-105'>
      <div className="flex justify-center rounded-xl">
      <div className="p-5 lg:h-[250px] lg:w-[400px]">
        <h1 className="p-2 text-xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Productivity Data</h1>
        <Chart type="doughnut" data={productivitybarchartData} options={productivitybarchartOptions} className="" />
      </div>
      </div>
      </div>
      
    

      <div className='transition-transform duration-300 ease-in-out bg-white shadow-md rounded-xl hover:scale-105'>
      <div className="flex justify-center rounded-xl">
      <div className="p-5 lg:h-[120px] lg:w-[380px]">
        <h1 className="p-2 text-xl font-semibold text-white bg-purple-400 w-fit rounded-xl">Allocated and Unallocated</h1>
        <Chart type="pie" data={allocationchartData} options={allocationchartOptions} className="" />
      </div>
      </div>
      </div>
      </div>

      

      <div className="grid justify-center grid-cols-1 gap-3 mt-5 lg:grid-cols-2">
      <div className='transition-transform duration-300 ease-in-out bg-white shadow-md rounded-xl hover:scale-105'>
      <div className="p-5">
        <h1 className="p-2 text-xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Telecaller Leads</h1>
        <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
      </div>
      </div>

      <div className='transition-transform duration-300 ease-in-out bg-white shadow-md rounded-xl hover:scale-105 '>
      <div className="p-5">
        <h1 className="p-2 text-xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Products Count</h1>
        <Chart type="bar" data={procuctsbarchartData} options={productsbarchartOptions} className="" />
      </div>
      </div>
      </div>
      </>
  );
}
