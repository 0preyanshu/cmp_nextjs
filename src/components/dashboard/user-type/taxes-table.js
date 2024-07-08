'use client';

import * as React from 'react';
import RouterLink from 'next/link';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

import { paths } from '@/paths';

import { DataTable } from '@/components/core/data-table';

import { useDispatch } from 'react-redux';
import { TaxActions } from '@/redux/slices';
import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';  
import { Privilages } from '@/components/core/privilages';

export function TaxesTable({ rows }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const mapPrivilegesToObject = (privileges) => {
    const result = {};

    // Handle generic privileges
    privileges.genericPrivilages.forEach(privilege => {
      result[privilege.id] = privilege.privilegeName;
    });

    // Handle nested privileges
    Object.keys(privileges.nestedPrivilages).forEach(category => {
      privileges.nestedPrivilages[category].forEach(privilege => {
        result[privilege.id] = privilege.privilegeName;
      });
    });

    return result;
  };

  // Example usage
  const privilegesObject = useMemo(() => mapPrivilegesToObject(Privilages), []);

  const getPrivilegesNames = (ids) => {
    if (!ids || !ids.length) {
      return 'No Privileges';
    }
    const names = ids.map(id => privilegesObject[id]).filter(Boolean);
    return names.length ? names.join(', ') : 'No Privileges';
  };

  const { createTax, updateTax, fetchTaxes } = TaxActions;

  const columns = [
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginLeft: 0 }}>
          {'   '}
          <div>
            <Link>
              {row.userTypeName}
            </Link>
          </div>
        </Stack>
      ),
      name: 'User Type',
      width: '250px',
    },
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginLeft: 0 }}>
          {'   '}
          <div>

              {getPrivilegesNames(row.defaultPrivileges)}
          
          </div>
        </Stack>
      ),
      name: 'Default Privileges',
      width: '340px',
    },
    {
      formatter: (row) => (
        <div style={{ display: "flex" }}>
          <IconButton component={RouterLink} href={paths.dashboard.usertype.edit(row.id)}>
            <PencilSimpleIcon />
          </IconButton>
          {/* Uncomment and update the below block if you need delete functionality */}
          {/* <IconButton onClick={async () => {
              const { status_ } = row;
              const data = {
                status_: status_ === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                id: row.id
              };
              await dispatch(updateTax(data)).then((res) => {
                if (res?.payload?.data) {
                  toast.success('Details updated');
                  router.push(paths.dashboard.usertype.list);
                } else {
                  toast.error(res?.payload?.message || 'Internal Server Error');
                }
              });
            }}>
              <TrashSimpleIcon />
          </IconButton> */}
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
