/* eslint-disable react/prop-types */
import { Sidebar } from "primereact/sidebar"
import { useMediaQuery } from 'react-responsive';
import { NavLink } from "react-router-dom";
import useAuth from "../../shared/services/store/useAuth";

const CrmSidebar = (props) => {

  const { visible, setvisible } = props;
  const { userdetails } = useAuth();

  const isMobile = useMediaQuery({ query: '(max-width: 971px)' });
  const handleLinkClick = () => {

    if (isMobile) {
      setvisible(false);
    }
  };

  return (
    <>
      <Sidebar visible={visible} onHide={() => setvisible(false)} showCloseIcon={false} dismissable={false} modal={false} className=''>
        <div className="overflow-x-hidden fixed top-0 start-0 bottom-0 z-[60] w-80 bg-cyan-400 border-gray-200 pt-7 pb-10 overflow-y-auto  ">
          <div className="flex flex-row">

            <a className="flex mx-8 text-xl font-semibold" href="#" aria-label="Brand">
              <img src="/images/logo.svg" alt="" className="object-cover h-20 w-44" />
            </a>
            <img className='cursor-pointer ' src="/images/filter.svg" onClick={() => setvisible(false)} />

          </div>

          <nav className="flex flex-col flex-wrap w-full p-6 hs-accordion-group" data-hs-accordion-always-open>
            <ul className="space-y-1.5">
              <li>
                <NavLink
                  to={"/dashboard"}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-x-3.5 py-2 px-2.5 w-80 ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                    } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                  }
                >
                   <div className="p-2 bg-white rounded-lg">
                <img src="/images/dashboard.png" alt="" className="w-7 h-7" /></div>
                  Dashboard
                </NavLink>
              </li>

              {userdetails()?.Role === "SuperAdmin" && (
                <li>
                  <NavLink
                    to={"/users"}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                      } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                    }
                  >
                    <div className="p-2 bg-white rounded-lg">
                    <img src="/images/profile.png" alt="" className=" w-7 h-7" /> 
                    </div>
                     Users
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink
                  to={"/teams"}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                    } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                  }
                >
                   <div className="p-2 bg-white rounded-lg">
                 <img src="/images/partners.png" alt="" className="w-7 h-7" /> </div>
                 Teams
                </NavLink>
              </li>

              {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
                <li className="relative group">
                  <div className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-black rounded-lg cursor-pointer hover:bg-white hover:text-black">
                  <div className="p-2 bg-white rounded-lg">
                  <img src="/images/human-resources.png" alt="" className="w-7 h-7" /> </div>
                  Allocation
                    <svg
                      className="w-4 h-4 ml-auto transition-transform duration-300 transform group-hover:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <ul className="hidden px-2 mt-1 space-y-1 group-hover:block">
                    {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
                      <li>
                        <NavLink
                          to="/unallocation"
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-white text-black shadow" : "text-black"
                            } text-sm rounded-lg hover:bg-white hover:text-black`
                          }
                        >
                           <div className="p-2 bg-white rounded-lg">
                           <img src="/images/unallocation.png" alt="" className="w-7 h-7" /></div>
                           Unallocated
                        </NavLink>
                      </li>
                    )}
                    {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
                      <li>
                        <NavLink
                          to="/allocation"
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-white text-black shadow" : "text-black"
                            } text-sm rounded-lg hover:bg-white hover:text-black`
                          }
                        >
                           <div className="p-2 bg-white rounded-lg">
                          <img src="/images/selection.png" alt="" className="w-7 h-7" /> </div>
                          Allocated
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}


              <li>
                <NavLink
                  to={"/telecallerleads"}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                    } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                  }
                >
                   <div className="p-2 bg-white rounded-lg">
                 <img src="/images/svg.png" alt="" className="w-7 h-7" /> </div>
                 Telecaller Leads
                </NavLink>
              </li>

              {(userdetails()?.Role === "SuperAdmin" ||
                userdetails()?.Role === "TeamLeader") && (
                  <li>
                    <NavLink
                      to={"/productivity"}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                        } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                      }
                    >
                       <div className="p-2 bg-white rounded-lg">
                      <img src="/images/productivity.png" alt="" className="w-7 h-7" /> </div>
                      Productivity
                    </NavLink>
                  </li>
                )}

            </ul>
          </nav>
        </div>
      </Sidebar>
    </>
  );
};

export default CrmSidebar;