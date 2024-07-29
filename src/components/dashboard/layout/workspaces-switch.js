'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import { usePopover } from '@/hooks/use-popover';

import { workspaces, WorkspacesPopover } from './workspaces-popover';

export function WorkspacesSwitch() {
  const popover = usePopover();
  const workspace = workspaces[0];

  return (
    null
  );
}
