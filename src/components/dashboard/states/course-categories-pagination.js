'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

export function CustomersPagination({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page - 1} // MUI TablePagination uses zero-based index for page
      rowsPerPage={rowsPerPage}
      onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // Adjusting to one-based index for page
      onRowsPerPageChange={(event) => onRowsPerPageChange(event)}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
