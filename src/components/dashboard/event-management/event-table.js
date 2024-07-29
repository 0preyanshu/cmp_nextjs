'use client';

import * as React from 'react';
import RouterLink from 'next/link';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as TrashSimpleIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import { Clipboard as ClipboardIcon } from '@phosphor-icons/react/dist/ssr/Clipboard';
import Button from '@mui/material/Button';
import { paths } from '@/paths';

import { DataTable } from '@/components/core/data-table';
import { useDispatch } from 'react-redux';
import { EventsActions } from '@/redux/slices';
import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';
import { Avatar } from '@mui/material';

export function EventTable({ rows }) {
  const dispatch = useDispatch();
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const { updateEvents } = EventsActions;

  const columns = [
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'left', marginLeft: 0 }}>
          <div>
            <Link>{formatDate(row.eventStartDate)}</Link>
          </div>
        </Stack>
      ),
      name: 'Start Date',
      width: '100px',
    },
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'left' }}>
          <Avatar src={row?.course?.courseLogo || ''} />
          <div>
            <Link>{row.eventName}</Link><br />
            {`${formatDateTime(row.eventStartDate)} - ${formatDateTime(row.eventEndDate)}`}<br />
            <b>Sale Validity</b>: {formatDateTime(row.salesDescription.saleEndDate)}<br />
            <Button
              variant="outlined"
              size="small"
              sx={{my:1}}
              startIcon={<ClipboardIcon />}
              onClick={() => {
                const { id } = row;
                const { taxable, taxID,currencyID } = row.eventPrice[0];
                const baseUrl = `${window.location.origin}/payment?eventID=${id}&currencyID=${currencyID}`;
                const url = taxable ? `${baseUrl}&taxID=${taxID}` : baseUrl;
            
                navigator.clipboard.writeText(url).then(() => {
                  toast.success('URL copied to clipboard');
                }).catch(err => {
                  toast.error('Failed to copy URL');
                });
              }}
            >
              Copy
            </Button>
          </div>
        </Stack>
      ),
      name: 'Event Info',
      width: '300px',
    },
    {
      formatter(row) {
        const instructors = row?.instructor[0] || [];
        return `${instructors.firstname || "-"} ${instructors.lastname || "-"}`;
      },
      name: 'Instructors',
      width: '200px',
    },
    {
      formatter: (row) => {
        const mapping = {
          active: { label: 'Active', icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
          blocked: { label: 'Blocked', icon: <MinusIcon color="var(--mui-palette-error-main)" /> }
        };
        const value = (row.status_ === 'ACTIVE') ? 'active' : 'blocked';
        const { label, icon } = mapping[value] ?? { label: 'Unknown', icon: null };
        return <Chip icon={icon} label={label} size="small" variant="outlined" />;
      },
      name: 'Status',
      width: '150px',
    },
    {
      formatter: (row) => (
        <div style={{ display: "flex" }}>
          <IconButton component={RouterLink} href={paths.dashboard.eventmanagement.edit(row.id)}>
            <PencilSimpleIcon />
          </IconButton>
          <IconButton
            onClick={async () => {
              const { status_ } = row;
              const data = {
                status_: status_ === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                id: row.id
              };
              await dispatch(updateEvents(data)).then((res) => {
                if (res?.payload?.data?.data) {
                  toast.success('Details updated');
                  router.push(paths.dashboard.eventmanagement.list);
                } else {
                  toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
                }
              });
            }}
          >
            <TrashSimpleIcon />
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
