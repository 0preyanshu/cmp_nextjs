'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, CardContent, Grid, Typography, Box, Tab, Tabs, Divider } from '@mui/material';
import Chart from 'react-apexcharts';
import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { AnalyticsFilters } from '@/components/dashboard/overview/analytics-filters';
import { AnalyticsTable } from '@/components/dashboard/overview/analytics-table';
import { Pagination } from '@/components/core/pagination';
import { AnalyticsActions } from '@/redux/slices';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import TableSkeleton from '@/components/core/Skeletion';
import { useTheme } from '@mui/material/styles';

const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

const transformGraphData = (newGraphData, period) => {
  console.log("n", newGraphData);
  if (!newGraphData || !period || newGraphData=={}) return { series: [], categories: [] };

  const periodData = newGraphData?.find(data => data?.period === period);
  const categories = periodData?.data?.map(point => point?.x);
  const series = [
    {
      name: 'Orders',
      data: periodData?.data?.map(point => point.orders),
    },
    {
      name: 'Vendors',
      data: periodData?.data?.map(point => point.vendors),
    },
    {
      name: 'Internal',
      data: periodData?.data?.map(point => point.internal),
    }
  ];

  return { series, categories };
};

const DashboardPage = ({ searchParams }) => {
  const theme = useTheme();
  const [timeline, setTimeline] = useState('today');
  const { dataLoading, analyticsData, graphData, analyticsLoading } = useSelector((state) => state.analytics);
  const { getAnalyticsData, getData } = AnalyticsActions;
  const dispatch = useDispatch();
  const [summaryData, setSummaryData] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const router = useRouter();

  const { page = 1, limit = 10, startDate, endDate } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));

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
    tooltip: {
      theme: theme.palette.mode, // Ensure the theme is set to 'light' or 'dark' as per your requirement
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

  const fetchSummaryData = async () => {
    setSummaryLoading(true);
    try {
      const response = await axios.get(`${HOST_API}/dashboard/data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
        },
      });
      setSummaryData(response.data?.data?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const isInitialMount = React.useRef(true);

  useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      startDate: startDate || "",
      endDate: endDate || "",
    };

    if (isInitialMount.current) {
      console.log('Initial mount');

      dispatch(getData());
      dispatch(getAnalyticsData(data));
      fetchSummaryData();
      isInitialMount.current = false;
    } else {
      console.log('Subsequent update');
      dispatch(getAnalyticsData(data));
      updateSearchParams({ page: currentPage, limit: rowsPerPage, startDate, endDate });
    }
  }, [currentPage, rowsPerPage, startDate, endDate]);


  const handleTimelineChange = (event, newValue) => {
    setTimeline(newValue);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    ({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    ({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newFilters, newSortDir) => {
    const searchParams = new URLSearchParams();


    if (newFilters.searchTerm) {
      searchParams.set('searchTerm', newFilters.searchTerm);
    }

    if (newFilters.page) {
      searchParams.set('page', newFilters.page);
    }

    if (newFilters.limit) {
      searchParams.set('limit', newFilters.limit);
    }
    if (newFilters.startDate) {
      searchParams.set('startDate', newFilters.startDate);
    }
    if (newFilters.endDate) {
      searchParams.set('endDate', newFilters.endDate);
    }

    router.push(`${paths.dashboard.overview}?${searchParams.toString()}`, { scroll: false });
  };

  const currentChartData = useMemo(() => transformGraphData(graphData, timeline), [graphData, timeline]);

  const isLoading = dataLoading || summaryLoading;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
                      {item.period.charAt(0).toUpperCase() + item.period.slice(1)}
                    </Typography>
                    <Row title="Orders" label={item.totalOrders} value={"$" + item.totalMoney} color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#212B36'} />
                    <Row title="Internal" label={item.internalOrders} value={"$" + item.internalMoney} color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#212B36'} />
                    <Row title="Vendor" label={item.vendorOrders} value={"$" + item.totalMoney} color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#212B36'} />
                    <Row title="Total" label={item.totalOrders} value={"$" + item.totalMoney} fontWeight="bold" color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#212B36'} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ my: 4 }}>
            <Typography variant="h5" mb={3}>Analytics</Typography>
            <Card>
              <AnalyticsFilters filters={{ startDate, endDate }} />
              <Divider />
              <Box sx={{ overflowX: 'auto' }}>
                {analyticsLoading && <TableSkeleton />}
                {!analyticsLoading && <AnalyticsTable rows={analyticsData} />}

              </Box>
              <Divider />
              <Pagination page={currentPage - 1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
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
              <Tab label="Last 12 Months" value="lastYear" />
            </Tabs>
            <Chart options={{ ...chartOptions, xaxis: { categories: currentChartData.categories } }} series={currentChartData.series} type="line" height={350} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

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

export default DashboardPage;
