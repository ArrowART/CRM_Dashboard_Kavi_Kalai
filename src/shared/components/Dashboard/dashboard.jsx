/* eslint-disable react/prop-types */
import { Chart } from 'primereact/chart';

export default function Dashboard(props) {

  const {chartData,chartOptions,barchartData,barchartOptions,procuctsbarchartData,productsbarchartOptions
    ,productivitybarchartData,productivitybarchartOptions}=props;

    return (
    <div className="grid justify-center grid-cols-1 gap-3 lg:grid-cols-2">
      <div className='bg-white shadow-md rounded-xl'>
      <div className="flex justify-center rounded-xl">
      <div className="p-5 lg:h-[200px] lg:w-[400px]">
        <h1 className="p-2 text-2xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Total Users</h1>
        <Chart type="pie" data={chartData} options={chartOptions} className="" />
      </div>
      </div>
      </div>
      
      <div className='bg-white shadow-md rounded-xl'>
      <div className="p-5">
        <h1 className="p-2 text-2xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Telecaller Leads</h1>
        <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
      </div>
      </div>

      <div className='bg-white shadow-md rounded-xl'>
      <div className="flex justify-center rounded-xl">
      <div className="p-5 lg:h-[300px] lg:w-[450px]">
        <h1 className="p-2 text-2xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Productivity Data</h1>
        <Chart type="doughnut" data={productivitybarchartData} options={productivitybarchartOptions} className="" />
      </div>
      </div>
      </div>

      <div className='bg-white shadow-md rounded-xl'>
      <div className="p-5">
        <h1 className="p-2 text-2xl font-semibold text-white bg-purple-400 rounded-xl w-fit">Products Count</h1>
        <Chart type="bar" data={procuctsbarchartData} options={productsbarchartOptions} className="" />
      </div>
      </div>
    </div>
  );
}
