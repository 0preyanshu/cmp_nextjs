'use client';

import * as React from 'react';
import RouterLink from 'next/link';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as TrashSimpleIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';

import { paths } from '@/paths';
import { DataTable } from '@/components/core/data-table';
import {Controller} from 'react-hook-form';



export function ParticipantsTable({ rows, showCheckboxes = false, control, setValue, watch }) {

  const handleCheckboxChange = (participantId, checked) => {
    console.log('participantId', participantId);
    const currentParticipantsToRemove =  watch("participantsToRemove")||[];
    console.log('currentParticipantsToRemove', currentParticipantsToRemove);
    const updatedParticipantsToRemove = checked
      ? [...currentParticipantsToRemove, participantId]
      : currentParticipantsToRemove.filter(id => id !== participantId);
 console.log('updatedParticipantsToRemove', updatedParticipantsToRemove);
    setValue('participantsToRemove', updatedParticipantsToRemove);
  };

  const columns = [
    ...(showCheckboxes
      ? [
          {
            formatter: (row) => (
              <Controller
                name={`participantsToRemove`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={watch('participantsToRemove').includes(row.participantID)}
                    onChange={(e) => handleCheckboxChange(row.participantID, e.target.checked)}
                  />
                )}
              />
            ),
            name: '',
            width: '50px',
          },
        ]
      : []),
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginLeft: 3 }}>
          {' '}
          <div>
            <Link>{row.participantFirstName || ''}</Link>
          </div>
        </Stack>
      ),
      name: 'First Name',
      width: '250px',
    },
    {
      formatter(row) {
        return row.participantLastName;
      },
      name: 'Last Name',
      width: '200px',
    },
    {
      formatter(row) {
        return row.participantEmail || '-';
      },
      name: 'Email',
      width: '200px',
    },
    {
      formatter(row) {
        return row.participantPhone || '-';
      },
      name: 'Phone',
      width: '200px',
    },
  ];

  return (
    <React.Fragment>
      <DataTable columns={columns} rows={rows} />
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
