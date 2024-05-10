import { Pagination } from '@nextui-org/react';
import { useMemo } from 'react';

export default function Tablepagination(props){
  
    const {rows,page,onPage,totalRecords,first}=props;

    const pages = useMemo(() => {
      return totalRecords ? Math.ceil(totalRecords / rows) : 0;
    }, [totalRecords, rows]);

    return(
        <div className="flex flex-wrap items-center justify-between w-full p-2 px-8 space-y-3">
          <div></div>
        {totalRecords > 0 && (<Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(page) => onPage(page)}
        />)
        }
        <div>Total Records : {totalRecords}</div>
      </div>
    )
}