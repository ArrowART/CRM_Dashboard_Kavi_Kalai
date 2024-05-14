/* eslint-disable react/prop-types */

import { Paginator } from 'primereact/paginator';
import { useMemo } from 'react';

export default function Allocationpagination({ rows, page, onPage, totalRecords, setRows }) {
  const pages = useMemo(() => {
    return totalRecords ? Math.ceil(totalRecords / rows) : 0;
  }, [totalRecords, rows]);

  const handlePageChange = (event) => {
    onPage(event.page + 1);
    setRows(event.rows);
  };

  return (
    <div className="flex flex-wrap items-center justify-between w-full p-2 px-8 space-y-3">
      <div></div>
      {totalRecords > 0 && (
        <Paginator
          first={rows * (page - 1)}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[10, 20, 30]}
        />
      )}
      <div>Total Records: {totalRecords}</div>
    </div>
  );
}
