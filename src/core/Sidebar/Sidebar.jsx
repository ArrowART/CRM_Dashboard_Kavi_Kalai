/* eslint-disable react/prop-types */
import { Sidebar } from "primereact/sidebar";
import { useMediaQuery } from 'react-responsive';
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../../shared/services/store/useAuth";
import { Tooltip } from "@nextui-org/react";
import { useEffect } from "react";

const CrmSidebar = (props) => {
  const { visible, setvisible } = props;
  const { userdetails } = useAuth();
  const isMobile = useMediaQuery({ query: '(max-width: 971px)' });
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMobile) {
      setvisible(false);
    }
  };

  useEffect(() => {
    setvisible(isMobile ? false : true);
  }, [isMobile]);

  const isActiveUsersAndTeams = location.pathname.startsWith("/users") || location.pathname.startsWith("/teams");
  const isActiveAllocationAndUnallocation = location.pathname.startsWith("/unallocation") || location.pathname.startsWith("/allocation");


  return (
    <>
      <Sidebar
        visible={visible}
        onHide={() => setvisible(false)}
        showCloseIcon={false}
        dismissable={false}
        modal={false}
        className='rounded-r-2xl'
      >
        <div className="overflow-x-hidden fixed top-0 start-0 bottom-0 z-[60] w-80 bg-cyan-400 border-gray-200 pt-7 pb-10 overflow-y-auto rounded-r-2xl">
          <div className="flex flex-row">
            <a className="flex mx-8 text-xl font-semibold" href="#" aria-label="Brand">
              <img src="/images/logo.svg" alt="" className="object-cover h-20 w-44" />
            </a>
            <img
              className='cursor-pointer'
              src="/images/filter.svg"
              onClick={() => setvisible(false)}
            />
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
                    <img src="/images/dashboard1.png" alt="" className="w-9 h-9" />
                  </div>
                  Dashboard
                </NavLink>
              </li>

              {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
                <li>
                  <NavLink
                    to={"/users"}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 w-80 ${isActiveUsersAndTeams || isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                      } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                    }
                  >
                    <div className="p-2 bg-white rounded-lg">
                      <img src="/images/users1.png" alt="" className="w-9 h-9" />
                    </div>
                    Users & Teams
                  </NavLink>
                </li>
              )}

              {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
                <li>
                  <NavLink
                    to="/unallocation"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 w-80 ${isActiveAllocationAndUnallocation || isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                      } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                    }
                  >
                    <div className="p-2 bg-white rounded-lg">
                      <img src="/images/dataallocation1.png" alt="" className="w-9 h-9" />
                    </div>
                    Data Allocation
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink
                  to={"/telecallerleads"}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-x-3.5 py-2 px-2.5 w-80 ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                    } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                  }
                >
                  <div className="p-2 bg-white rounded-lg">
                    <img src="/images/telecallerleads1.png" alt="" className="w-9 h-9" />
                  </div>
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
                        `flex items-center gap-x-3.5 py-2 px-2.5 w-80 ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""
                        } text-sm text-black hover:text-black rounded-lg hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow`
                      }
                    >
                      <div className="p-2 bg-white rounded-lg">
                        <img src="/images/productivity1.png" alt="" className="w-9 h-9" />
                      </div>
                      Productivity
                    </NavLink>
                  </li>
                )}
            </ul>
          </nav>
        </div>
      </Sidebar>

      {!visible && !isMobile && (
        <div className="fixed top-4 start-2 bottom-4 z-[60] w-24 bg-cyan-500 rounded-lg border-gray-200 pt-7 pb-10">

          <div className="mb-5 bg-white rounded-md">
            <img src="/images/cashflowimage.png" alt="" className="w-20 h-20 " />
          </div>
      
          <nav className="flex flex-col items-center space-y-4">
            <Tooltip content="Dashboard" placement="left-end">
              <NavLink
                to={"/dashboard"}
                onClick={handleLinkClick}
                className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`}
              >
                <img src="/images/dashboard1.png" alt="" className="w-9 h-9" />
              </NavLink>
            </Tooltip>

            {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader" )&& (
              <Tooltip content="Users & Teams" placement="left-end">
                <NavLink
                  to={"/users"}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `p-2 rounded-lg ${isActiveUsersAndTeams || isActive ? "bg-amber-200" : "bg-white"}`}
                >
                  <img src="/images/users1.png" alt="" className="w-9 h-9" />
                </NavLink>
              </Tooltip>
            )}

            {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
              <Tooltip content="Data Allocation" placement="left-end">
                <NavLink
                  to={"/unallocation"}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `p-2 rounded-lg ${isActiveAllocationAndUnallocation || isActive ? "bg-amber-200" : "bg-white"}`}
                >
                  <img src="/images/dataallocation1.png" alt="" className="w-9 h-9" />
                </NavLink>
              </Tooltip>
            )}

            <Tooltip content="TelecallerLeads" placement="left-end">
              <NavLink
                to={"/telecallerleads"}
                onClick={handleLinkClick}
                className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`}
              >
                <img src="/images/telecallerleads1.png" alt="" className="w-9 h-9" />
              </NavLink>
            </Tooltip>

            {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
              <Tooltip content="Productivity" placement="left-end">
                <NavLink
                  to={"/productivity"}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`}
                >
                  <img src="/images/productivity1.png" alt="" className="w-9 h-9" />
                </NavLink>
              </Tooltip>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default CrmSidebar;
