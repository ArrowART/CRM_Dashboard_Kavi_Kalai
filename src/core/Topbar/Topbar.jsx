/* eslint-disable react/prop-types */
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import useAuth from "../../shared/services/store/useAuth";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";


export default function Topbar(props) {
 const { visible, setvisible } = props;
  const { userdetails, logout } = useAuth()
  const navigate = useNavigate();
 
  const isMobile = useMediaQuery({ query: '(max-width: 971px)' });

  const imageMap = {
    'SuperAdmin': '../images/letter-s.png',
    'TeamLeader': '../images/letter-t.png',
    'Telecaller': '../images/letter-c.png',
    'default': 'https://example.com/default.png',
  };

  const getAvatarImage = () => {
    const role = userdetails()?.Role;
    switch (role) {
      case 'SuperAdmin':
        return  imageMap['SuperAdmin']
      case 'TeamLeader':
        return  imageMap['TeamLeader']
      case 'Telecaller':
        return  imageMap['Telecaller']
      default:
        return  imageMap['default']
    }
  };

  const handleToggleClick = () => {
    setvisible(!visible);
  };


  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };
  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-gradient-to-b from-cyan-400 to-cyan-200 border-b text-sm py-2.5 sm:py-4 lg:ps-4">
      <nav className="flex items-center w-full px-4 mx-auto basis-full sm:px-6 md:px-8" aria-label="Global">
      <div className="me-5 lg:me-0">
            <a className="flex flex-row text-2xl font-bold lg:flex-row-reverse dark:text-white" href="#" aria-label="">
              {isMobile ? (
                <>
                 <button type="button" className={`text-gray-500 hover:text-gray-600 lg:px-6`} data-hs-overlay="#application-sidebar"aria-controls="application-sidebar"aria-label="Toggle navigation"onClick={handleToggleClick}>
                    <span className="sr-only">Toggle Navigation</span>
                    <svg className={`flex-shrink-0 w-4 h- ${visible ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <line x1="3" x2="21" y1="12" y2="12" />
                      <line x1="3" x2="21" y1="18" y2="18" />
                    </svg>
                  </button>
                  <div className="flex logo-container">
                    <img className="px-2" src="../images/logo.svg" alt="" />
                  </div>
                </>
              ) : (
                <>
                  <button type="button" className={`text-gray-500 hover:text-gray-600 lg:px-12 ${visible ? 'hidden' : ''}`}data-hs-overlay="#application-sidebar"aria-controls="application-sidebar"aria-label="Toggle navigation"onClick={handleToggleClick} >
                    <span className="sr-only">Toggle Navigation</span>
                    <svg className={`flex-shrink-0  ${visible ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <line x1="3" x2="21" y1="12" y2="12" />
                      <line x1="3" x2="21" y1="18" y2="18" />
                    </svg>
                  </button>
                  {!visible && (
                    <div className="flex -mx-4 logo-container">
                      <img className="px-2" src="../images/logo.svg" alt="" /> 
                    </div>
                  )}
                   
                </>
              )}
            </a>
           
          </div>
        <div className="flex items-center justify-end w-full ms-auto sm:justify-between sm:gap-x-3 sm:order-3 lg:rounded-xl lg:border lg:p-5">
          {/* <div className="sm:hidden">
            <button type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ">
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
          </div> */}
          <div className="hidden sm:block">
            <label htmlFor="icon" className="sr-only">Search</label>
            <div className="relative">
              {/* <div className="absolute inset-y-0 z-20 flex items-center pointer-events-none start-0 ps-4">
                <svg className="flex-shrink-0 text-gray-400 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <input type="text" id="icon" name="icon" className="block w-full px-4 py-2 text-sm border border-gray-200 outline-none ps-11 rounded-3xl disabled:opacity-50 disabled:pointer-events-none" placeholder="Search" /> */}
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <div className="">
              <h1 className="mx-1 text-lg font-semibold text-black lg:text-xl">{userdetails()?.Role}</h1>
            </div>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                size="sm"
                className="transition-transform"
                src={getAvatarImage()}
              />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="gap-2 h-14">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userdetails()?.Role}</p>
                </DropdownItem>
                <DropdownItem key="logout" onPress={handleLogout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </nav>
    </header>
  )
}