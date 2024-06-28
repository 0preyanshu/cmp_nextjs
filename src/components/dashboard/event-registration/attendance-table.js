"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';

const rows = [
  {
    serialNo: 1,
    name: 'bc',
    email: 'd@gmail.com',
    phone: '1234567891',
    attendance: [false, true, false, false, false, false, false]
  },
  {
    serialNo: 1,
    name: 'bc',
    email: 'd@gmail.com',
    phone: '1234567891',
    attendance: [false, true, false, false, false, false, false]
  },
  {
    serialNo: 1,
    name: 'bc',
    email: 'd@gmail.com',
    phone: '1234567891',
    attendance: [false, true, false, false, false, false, false]
  },
  // Add more participants as needed
];

const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

export default function AttendanceTable() {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="attendance table">
          <TableHead>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Participant Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              {days.map((day, index) => (
                <TableCell key={index}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{row.serialNo}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                {row.attendance.map((attended, dayIndex) => (
                  <TableCell key={dayIndex}>
                    <Checkbox checked={attended} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No Data
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
