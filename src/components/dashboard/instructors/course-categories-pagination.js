'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import TablePagination from '@mui/material/TablePagination';

export function CustomersPagination({ count, rowsPerPage, onPageChange, onRowsPerPageChange,page }) {


  const labelDisplayedRows = ({ from, to, count }) => {
    return `Page ${page+1} `;
  };

  return (
    <TablePagination
      component="div"
      count={100000000000}
      page={page} // MUI TablePagination uses zero-based index for page
      rowsPerPage={rowsPerPage}
      onPageChange={(event, newPage) => onPageChange(event, newPage+1)} // Adjusting to one-based index for page
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25]}
      labelDisplayedRows={labelDisplayedRows}
    />
  );
}
