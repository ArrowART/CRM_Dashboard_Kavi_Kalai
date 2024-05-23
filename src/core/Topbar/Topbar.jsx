import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import useAuth from "../../shared/services/store/useAuth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {

  const { userdetails, logout } = useAuth()
  const navigate = useNavigate();

  const imageMap = {
    'SuperAdmin': '../images/square-s.png',
    'TeamLeader': '../images/square-t.png',
    'Telecaller': '../images/square-c.png',
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

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };
  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white  text-sm py-2.5 sm:py-4 lg:ps-[17rem] ">
      <nav className="flex items-center w-full px-4 mx-auto basis-full sm:px-6 md:px-8" aria-label="Global">
        <div className="me-5 lg:me-0 lg:hidden">
          <img src="../images/cashflow-logo.png" alt="" />
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
              <div className="absolute inset-y-0 z-20 flex items-center pointer-events-none start-0 ps-4">
                <svg className="flex-shrink-0 text-gray-400 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <input type="text" id="icon" name="icon" className="block w-full px-4 py-2 text-sm border border-gray-200 outline-none ps-11 rounded-3xl disabled:opacity-50 disabled:pointer-events-none" placeholder="Search" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <div className="">
              <h1 className="font-semibold text-blue-600 mx-1text-lg lg:text-xl">{userdetails()?.Role}</h1>
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