import { Outlet } from 'react-router-dom';
import Topbar from '../Topbar/Topbar';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';
import CrmSidebar from '../Sidebar/Sidebar';

export const Main = () => {
  const isMobile = useMediaQuery({
    query: '(max-width:971px)'
  });
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    setvisible(isMobile ? false : true);
  }, [isMobile]);

  return (
    <>
      <Topbar visible={visible} setvisible={setvisible} />
      <CrmSidebar visible={visible} setvisible={setvisible} />
      <main
        className={`w-full px-4 sm:px-6 md:px-8 py-4 ${visible ? "lg:pl-[18%]" : "lg:pl-[7rem]"}`}
      >
        <Outlet />
      </main>
    </>
  );
};
