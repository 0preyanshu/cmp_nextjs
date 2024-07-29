'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Copy as CopyIcon } from '@phosphor-icons/react/dist/ssr/Copy';

import { paths } from '@/paths';
import { DataTable } from '@/components/core/data-table';
import { toast } from '@/components/core/toaster';
import { Clipboard as ClipboardIcon } from '@phosphor-icons/react/dist/ssr/Clipboard';

export function EventTable({ rows }) {
  const router = useRouter();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
    return `${formattedDate} ${formattedTime}`;
  }

  const handleCopy = (event, row) => {
    event.stopPropagation();
    const url = `${window.location.origin}${paths.dashboard.eventregistration.attendance(row.id)}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL copied to clipboard!');
    }).catch(err => {
      toast.error('Failed to copy URL');
    });
  };

  const handleRowClick = (event, row) => {
    router.push(paths.dashboard.eventregistration.analytics(row.id));
  };

  const columns = [
    {
      formatter(row) {
        return row?.course?.courseName || "-";
      },
      name: 'Course',
      width: '150px',
    },
    {
      formatter(row) {
        return row?.eventName;
      },
      name: 'Event Name',
      width: '150px',
    },
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'left', marginLeft: 0 }}>
          <div>
            <Link>
              {formatDate(row.eventStartDate)}
            </Link>
          </div>
        </Stack>
      ),
      name: 'Start Date',
      width: '150px',
    },
    {
      formatter(row) {
        const instructors = row?.instructor[0] || [];
        return (instructors.firstname || "-") + " " + (instructors.lastname || "-");
      },
      name: 'Instructors',
      width: '150px',
    },
    {
      formatter(row) {
        return row.registered;
      },
      name: 'Registered',
      width: '100px',
    },
    {
      formatter(row) {
        return row.capacity;
      },
      name: 'Capacity',
      width: '100px',
    },
    {
      formatter(row) {
        return row.waitlistCapacity;
      },
      name: 'Remaining',
      width: '100px',
    },
    {
      formatter(row) {
        return row.abandoned;
      },
      name: 'Abandoned',
      width: '100px',
    },
    {
      formatter(row) {
        return row.waitlist;
      },
      name: 'Waitlisted',
      width: '100px',
    },
    {
      formatter(row) {
        return "True"; // get from backend
      },
      name: 'Joining Email',
      width: '100px',
    },
    {
      formatter(row) {
        return row.show ? "LIVE" : "COMPLETED"; // get from backend
      },
      name: 'Event Status',
      width: '100px',
    },
    {
      formatter(row) {
        return row.timezone?.timezoneName || "-"; // get from backend
      },
      name: 'Timezone',
      width: '150px',
    },
    {
      formatter: (row) => (
        <div style={{ display: "flex",zIndex:+10 }}>
          <IconButton onClick={(event) => handleCopy(event, row)}>
            <CopyIcon />
          </IconButton>
        </div>
      ),
      name: 'Actions',
      width: '100px',
    },
  ];

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        rows={rows}
        onClick={handleRowClick}
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No Data
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
