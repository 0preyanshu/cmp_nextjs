'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Grid, Paper, Typography, Box, CircularProgress, Divider, Select, 
  MenuItem, Button, Avatar, Card 
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ReactApexChart from 'react-apexcharts';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ParticipantsTable } from '@/components/dashboard/event-registration/participants-table';
import EmailModal from '@/components/dashboard/event-registration/emailmodal';
import { current } from '@reduxjs/toolkit';
import { toast } from '@/components/core/toaster';
import { paths } from '@/paths';


const Analytics = () => {
  const { id } = useParams();
  const { allEvents, loading: isLoading } = useSelector((state) => state?.event?.events);
  const [currentEvent, setCurrentEvent] = useState({});

  useEffect(() => {
    if (allEvents?.length && id) {
      const data = allEvents.find((event) => String(event?.id) === String(id));
      setCurrentEvent(data);
      console.log(data, "dataofevent");
    }
  }, [allEvents, id]);

  const data = useMemo(() => ({
    totalRevenue: '211.21k',
    totalFees:currentEvent?.eventPrice?.regularPrice ||0,
    totalTax: 0,
    netProfit: '211.21k',
    orders: 1,
    participants: 1,
    abandonedParticipants: currentEvent?.abandoned || 0,
    waitlistParticipants: currentEvent?.waitlist || 0 ,
    cancelled: 0,
    refunded: 0,
    stripe: 0,
    paypal: 0,
  }), [currentEvent]);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} mb={5}>
          <BarGraphComponent currentEvent={currentEvent} />
        </Grid>
        {[
          { title: 'Total Revenue', value: data.totalRevenue, color: 'primary' },
          { title: 'Total Fees', value: data.totalFees, color: 'secondary' },
          { title: 'Total Tax', value: data.totalTax, color: 'warning.main' },
          { title: 'Net Profit', value: data.netProfit, color: 'error' }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} mb={5} key={index}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h5" color={item.color}>
                {item.value}
              </Typography>
              <Typography>{item.title}</Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} md={6} mb={5}>
          <CustomCircularProgress title="Orders" value={data.orders} color="success" />
        </Grid>
        <Grid item xs={12} md={6} mb={5}>
          <CustomCircularProgress title="Participants" value={data.participants} color="error" />
        </Grid>
        {[
          { title: 'Abandoned Participants', value: data.abandonedParticipants },
          { title: 'Waitlist Participants', value: data.waitlistParticipants },
          { title: 'Cancelled', value: data.cancelled },
          { title: 'Refunded', value: data.refunded },
          { title: 'Stripe', value: data.stripe },
          { title: 'Paypal', value: data.paypal }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} mb={5} key={index}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{item.value}</Typography>
              <Typography>{item.title}</Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item md={12}>
          <Typography sx={{ mb: 2, ml: 2 }}>Participants</Typography>
          <Card>
            <Box sx={{ overflowX: 'auto' }}>
              <ParticipantsTable rows={[]} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const CustomCircularProgress = ({ title, value, color }) => (
  <Paper sx={{ padding: 2 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, position: 'relative' }}>
      <CircularProgress variant="determinate" value={100} color={color} size={150} thickness={4} />
      <Box sx={{ position: 'absolute' }}>
        <Typography variant="h5" align="center">{value}</Typography>
        <Typography align="center">Total</Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
        <Box sx={{ width: 10, height: 10, backgroundColor: 'lightgreen', marginRight: 1 }} />
        <Typography>Internal</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 10, height: 10, backgroundColor: 'green', marginRight: 1 }} />
        <Typography>Vendors</Typography>
      </Box>
    </Box>
  </Paper>
);

const BarGraphComponent = ({currentEvent}) => {
  const [timeFrame, setTimeFrame] = useState('Week');
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (event) => {
    setTimeFrame(event.target.value);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const data = useMemo(() => ({
    chart: { animations: { enabled: true }, sparkline: { enabled: false } },
    stroke: { width: 2 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName) => seriesName.toLocaleString(),
        title: { formatter: () => '' },
      },
      marker: { show: false },
    },
    series: [{
      name: 'Participants',
      data: [0, 1, 0, 0, 0, 0, 0]
    }],
    options: {
      chart: { type: 'bar', height: 450 },
      plotOptions: { bar: { columnWidth: '25%' } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['2024/06/19', '2024/06/20', '2024/06/21', '2024/06/22', '2024/06/23', '2024/06/24', '2024/06/25'],
      },
      yaxis: {
        tickAmount: 5,
        labels: { style: { fontSize: '12px' } },
        axisBorder: { show: true },
        axisTicks: { show: true }
      },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 5,
      },
      title: {
        text: 'Participants Over Time',
        align: 'center'
      },
    },
  }), []);

  return (
    <Paper sx={{ width: '100%', padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <Avatar sx={{ mr: 1 }} />
          <Box>
            <Typography variant="h7">{currentEvent?.course?.courseName || "-"}</Typography>
            <Typography variant="subtitle2">
              {currentEvent.eventStartDate||"-"} - {(currentEvent.eventEndDate ||"-") + " " + (currentEvent?.timezone?.timezoneName || "Timezone")} 
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
          <Select value={timeFrame} onChange={handleChange} sx={{ mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 1 } }}>
            <MenuItem value="Week">Week</MenuItem>
            <MenuItem value="Two Weeks Ago">Two Weeks Ago</MenuItem>
            <MenuItem value="Last 12 Weeks">Last 12 Weeks</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
          </Select>
          <Button variant="contained" color="secondary" sx={{ mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 1 } }} onClick={()=>{
            const url = `${window.location.origin}${paths.dashboard.eventregistration.attendance(id)}`;
            navigator.clipboard.writeText(url).then(() => {
              toast.success('URL copied to clipboard!');
            }).catch(err => {
              toast.error('Failed to copy URL');
            });

          }}>
            Copy Attendance Url
          </Button>
          <Button variant="contained" color="secondary" onClick={handleOpenModal}>
            Send Email
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <ReactApexChart options={data.options} series={data.series} type="bar" height={450} />
      <EmailModal open={modalOpen} onClose={handleCloseModal} />
    </Paper>
  );
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default Analytics;
