import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Topbar from '../Topbar/Topbar';

export const Main = () => {

  return (
    <div>
      <Topbar />
      <Sidebar />
      <main className="w-full pt-10 lg:pt-5 px-4 sm:px-6 md:px-8 lg:ps-[19rem]  ">
        <Outlet />
      </main>
    </div>
  )
}
