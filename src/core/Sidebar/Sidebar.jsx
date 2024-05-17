import { NavLink } from "react-router-dom";
import useAuth from "../../shared/services/store/useAuth";

export default function Sidebar() {
  const { userdetails } = useAuth();
  return (
    <>
    <div className="sticky inset-x-0 top-0 z-20 px-4 bg-white border-y sm:px-6 md:px-8 lg:hidden">
      <div className="flex items-center py-4">
        <button type="button" className="text-gray-500 hover:text-gray-600" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Toggle navigation">
          <span className="sr-only">Toggle Navigation</span>
          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
        </button>

        <ol className="flex items-center ms-3 whitespace-nowrap" aria-label="Breadcrumb">
          <li className="flex items-center text-sm text-gray-800">
            Application Layout
            <svg className="flex-shrink-0 mx-3 overflow-visible size-2.5 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </li>
          <li className="text-sm font-semibold text-gray-800 truncate" aria-current="page">
            Dashboard
          </li>
        </ol>
      </div>
    </div>
      <div id="application-sidebar" className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-gradient-to-b rounded-xl m-3 from-green-500 to-green-400 border pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
        <div className="px-6">
          <a className="flex text-xl font-semibold" href="#" aria-label="Brand">
          <img src="/images/logo.svg" alt="" className="object-cover h-20 w-44" />
          </a>
        </div>
        <nav className="flex flex-col flex-wrap w-full p-6 hs-accordion-group" data-hs-accordion-always-open>
          <ul className="space-y-1.5">
          <li>
              <NavLink to={'/dashboard'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? 'bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
              <i className="fi fi-rr-phone-call"></i>
                Dashboard
              </NavLink>
            </li>
            {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
            <li>
              <NavLink to={'/productivity'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? ' bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
              <i className="fi fi-rr-megaphone"></i> Productivity
              </NavLink>
            </li>
            )}
            <li>
              <NavLink to={'/telecallerleads'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? ' bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
              <i className="fi fi-rr-megaphone"></i> Telecaller Leads
              </NavLink>
            </li>
            {/* {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
            <li>
              <NavLink to={'/followup'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? ' bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
              <i className="fi fi-rr-megaphone"></i>Follow Up
              </NavLink>
            </li>
            )} */}
            {/* {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
            <li>
              <NavLink to={'/leadsandwip'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? ' bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
                <i className="fi fi-rr-box-open-full"></i> Leads and Wip
              </NavLink>
            </li>
            )} */}
            {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
            <li>
              <NavLink to={'/allocation'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? ' bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
              <i className="fi fi-sr-cloud-upload-alt"></i> Allocation
              </NavLink>
            </li>
            )}
            {(userdetails()?.Role === 'SuperAdmin') && (
            <li>
              <NavLink to={'/users'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? ' bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
                <i className="fi fi-sr-users-alt"></i> Users
              </NavLink>
            </li>
            )}
            <li>
              <NavLink to={'/teams'} className={({ isActive }) => (`flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? ' bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow' : ''}  text-sm text-slate-700  hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd]  hover:shadow`)}>
              <i className="fi fi-ss-team-check"></i> Teams
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      </>
  )
}