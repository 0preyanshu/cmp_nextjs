'use client'
import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Unstable_Grid2';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Briefcase as BriefcaseIcon } from '@phosphor-icons/react/dist/ssr/Briefcase';
import { FileCode as FileCodeIcon } from '@phosphor-icons/react/dist/ssr/FileCode';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import { ListChecks as ListChecksIcon } from '@phosphor-icons/react/dist/ssr/ListChecks';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Warning as WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';

import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { AppChat } from '@/components/dashboard/overview/app-chat';
import { AppLimits } from '@/components/dashboard/overview/app-limits';
import { AppUsage } from '@/components/dashboard/overview/app-usage';
import { Events } from '@/components/dashboard/overview/events';
import { HelperWidget } from '@/components/dashboard/overview/helper-widget';
import { Subscriptions } from '@/components/dashboard/overview/subscriptions';
import { Summary } from '@/components/dashboard/overview/summary';
// import React from 'react';
import { Card, CardContent, Grid, Typography, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Chart from 'react-apexcharts';
import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { Divider } from '@mui/material';
import { AnalyticsFilters } from '@/components/dashboard/overview/analytics-filters';
import { AnalyticsTable } from '@/components/dashboard/overview/analytics-table';
import { TableSkeleton } from '@/components/core/Skeletion';
import { useSelector } from 'react-redux';
import { useUserPrivileges } from '@/hooks/use-privilages';
import { Pagination } from '@/components/core/pagination';



// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` };
const isLoading = false;

const summaryData = [
  { label: 'Today', orders: 0, internal: 0, vendor: 0, total: '$0' },
  { label: 'Yesterday', orders: 0, internal: 0, vendor: 0, total: '$0' },
  { label: 'This Week', orders: 0, internal: 0, vendor: 0, total: '$0' },
  { label: 'Last Week', orders: 2, internal: 2, vendor: 0, total: '$400' },
  { label: 'Last Week', orders: 2, internal: 2, vendor: 0, total: '$400' },
  { label: 'Last Week', orders: 2, internal: 2, vendor: 0, total: '$400' },
  { label: 'Last Week', orders: 2, internal: 2, vendor: 0, total: '$400' },
  { label: 'Last Week', orders: 2, internal: 2, vendor: 0, total: '$400' },
  
  // Add more data as needed
];

const analyticsData = [
  { course: 'React Development 2', orders: 20, internal: 20, vendor: 0, total: '$2700', abandoned: 0, waitlist: 0 },
  { course: 'Project Management Professional', orders: 17, internal: 14, vendor: 3, total: '$11063', abandoned: 0, waitlist: 0 },
  // Add more data as needed
];

// ApexCharts options
const chartData = {
  today: {
    series: [
      { name: 'Orders', data: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] },
      { name: 'Internal', data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      { name: 'Vendor', data: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4] },
      { name: 'Total', data: [0, 3, 6, 10, 13, 16, 20, 23, 26, 30, 33, 36, 40] },
    ],
    categories: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
  },
  yesterday: {
    series: [
      { name: 'Orders', data: [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] },
      { name: 'Internal', data: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
      { name: 'Vendor', data: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3] },
      { name: 'Total', data: [0, 1, 4, 7, 11, 14, 17, 20, 24, 27, 30, 33, 37] },
    ],
    categories: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
  },
  thisWeek: {
    series: [
      { name: 'Orders', data: [0, 10, 20, 30, 40, 50, 60] },
      { name: 'Internal', data: [0, 5, 10, 15, 20, 25, 30] },
      { name: 'Vendor', data: [0, 1, 2, 3, 4, 5, 6] },
      { name: 'Total', data: [0, 16, 32, 48, 64, 80, 96] },
    ],
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  lastWeek: {
    series: [
      { name: 'Orders', data: [0, 8, 16, 24, 32, 40, 48] },
      { name: 'Internal', data: [0, 4, 8, 12, 16, 20, 24] },
      { name: 'Vendor', data: [0, 1, 1, 2, 2, 3, 3] },
      { name: 'Total', data: [0, 13, 25, 38, 50, 63, 75] },
    ],
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  thisMonth: {
    series: [
      { name: 'Orders', data: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360] },
      { name: 'Internal', data: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180] },
      { name: 'Vendor', data: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] },
      { name: 'Total', data: [0, 47, 94, 141, 188, 235, 282, 329, 376, 423, 470, 517, 564] },
    ],
    categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
  },
  lastMonth: {
    series: [
      { name: 'Orders', data: [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300] },
      { name: 'Internal', data: [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144] },
      { name: 'Vendor', data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      { name: 'Total', data: [0, 38, 76, 114, 152, 190, 228, 266, 304, 342, 380, 418, 456] },
    ],
    categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
  },
  last12Months: {
    series: [
      { name: 'Orders', data: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300] },
      { name: 'Internal', data: [0, 150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500, 1650] },
      { name: 'Vendor', data: [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132] },
      { name: 'Total', data: [0, 462, 924, 1386, 1848, 2310, 2772, 3234, 3696, 4158, 4620, 5082] },
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};

// ApexCharts options
const chartOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    show: true,
  },
  grid: {
    show: false,
  },
};

export default function Page() {
  const [timeline, setTimeline] = useState('today');

  const handleTimelineChange = (event, newValue) => {
    setTimeline(newValue);
  };

  const currentChartData = chartData[timeline];
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Overview</Typography>
          </Box>
        </Stack>
        <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.label}
                </Typography>
                <Row title="Orders" label={item.orders} value={item.total} />
                <Row title="Internal" label={item.internal} value={item.total} />
                <Row title="Vendor" label={item.vendor} value={item.total} />
                <Row title="Total" label={item.orders} value={item.total} fontWeight="bold" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" mb={3}>Analytics</Typography>
        <Card>
          <AnalyticsFilters filters={{  }} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <AnalyticsTable rows={[{}]} />
            )}
          </Box>
          <Divider />
          <Pagination page={1} rowsPerPage={5}  />
        </Card>
        </Box>

      <Box>
        <Typography variant="h5" mb={3}>Orders Count Graph</Typography>
        <Tabs value={timeline} onChange={handleTimelineChange} variant="fullWidth">
          <Tab label="Today" value="today" />
          <Tab label="Yesterday" value="yesterday" />
          <Tab label="This Week" value="thisWeek" />
          <Tab label="Last Week" value="lastWeek" />
          <Tab label="This Month" value="thisMonth" />
          <Tab label="Last Month" value="lastMonth" />
          <Tab label="Last 12 Months" value="last12Months" />
        </Tabs>
        <Chart options={{ ...chartOptions, xaxis: { categories: currentChartData.categories } }} series={currentChartData.series} type="line" height={350} />
      </Box>
    </Box>
       
      </Stack>
    </Box>
  );
}

const Row = ({ title, label, value, fontWeight = 500, margin = '8px 0', color = '#212B36' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', margin, color, alignItems: 'stretch' }}>
    <Typography variant="body2" sx={{ fontWeight, width: '60px' }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight, width: '30px' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight, width: '65px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {value}
    </Typography>
  </div>
);