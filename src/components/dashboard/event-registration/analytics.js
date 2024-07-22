'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Grid, Card, Typography, Box, CircularProgress, Divider, Select, 
  MenuItem, Button, Avatar
} from '@mui/material';
import axios from 'axios';

import ReactApexChart from 'react-apexcharts';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ParticipantsTable } from '@/components/dashboard/event-registration/participants-table';
import EmailModal from '@/components/dashboard/event-registration/emailmodal';
import { current } from '@reduxjs/toolkit';
import { toast } from '@/components/core/toaster';
import { paths } from '@/paths';
import { Chart } from 'react-apexcharts';
import {HOST_API} from '@/config'


// const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

const handleCopy = (id) => {
  const url = `${window.location.origin}${paths.dashboard.eventregistration.attendance(id)}`;
  navigator.clipboard.writeText(url).then(() => {
    toast.success('URL copied to clipboard!');
  }).catch(err => {
    toast.error('Failed to copy URL');
  });
};


const Analytics = () => {
  const { id } = useParams();
  const { allEvents, loading: isLoading } = useSelector((state) => state?.event?.events);
  const [currentEvent, setCurrentEvent] = useState({});
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (allEvents?.length && id) {
      const data = allEvents.find((event) => String(event?.id) === String(id));
      setCurrentEvent(data);
      console.log(data, "dataofevent");
    }
  }, [allEvents, id]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${HOST_API}/event/analytics/${id}`,{
          headers: {Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`},
        });
        setAnalyticsData(response.data?.data?.event || null);
        console.log(response.data?.data, "response.data?.data");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalyticsData();
    }
  }, [id]);

  const data = useMemo(() => ({
    totalRevenue: analyticsData?.totalRevenue || 0,
    totalFees: analyticsData?.totalFees || 0,
    totalTax: analyticsData?.totalTax || 0,
    netProfit: analyticsData?.totalProfit || 0,
    orders: analyticsData?.totalOrders || 0,
    participants: analyticsData?.totalParticipants || 0,
    abandonedParticipants: analyticsData?.abandonedCart || 0,
    waitlistParticipants:analyticsData?.waitingList || 0,
    cancelled: analyticsData?.cancelled || 0,
    refunded: analyticsData?.refunded || 0,
    stripe: analyticsData?.stripe || 0,
    paypal: analyticsData?.paypal || 0,
    internalParticipants : analyticsData?.internalParticipants || 0,
    orderParticipants : analyticsData?.orderParticipants || 0,
    internalVendors : analyticsData?.internalVendors || 0,
    orderVendors : analyticsData?.orderVendors || 0,
  }), [currentEvent, analyticsData]);

  if (loading) {
    return <CircularProgress />;
  }


  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} mb={5}>
          <BarGraphComponent currentEvent={currentEvent} analyticsData={analyticsData} id={id} />
        </Grid>
        {[
          { title: 'Total Revenue', value: data.totalRevenue, color: 'primary' },
          { title: 'Total Fees', value: data.totalFees, color: 'secondary' },
          { title: 'Total Tax', value: data.totalTax, color: 'warning.main' },
          { title: 'Net Profit', value: data.netProfit, color: 'error' }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} mb={5} key={index}>
            <Card sx={{ padding: 4, boxShadow: 6 }}>
              <Typography variant="h5" color={item.color} fontWeight={'bold'} mb={1}>
                {item.value}
              </Typography>
              <Typography fontWeight={'bold'}>{item.title}</Typography>
            </Card>
          </Grid>
        ))}

        {/* todo - confirm the labels from backend */}
        <Grid item xs={12} md={6} mb={5}>
          <CustomCircularProgress title="Orders" color2={"#00EC93"} color1={"#0086FF"} label1={"Internal"} label2={"Vendors"} value2={data?.internalParticipants} value1={data?.orderVendors} />
        </Grid>
        <Grid item xs={12} md={6} mb={5}>
        <CustomCircularProgress title="Participants" color2={"#FF1752"} color1={"#FFB000"} label1={"Internal"} label2={"Vendors"} value2={data?.internalParticipants} value1={data?.orderVendors} />
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
            <Card sx={{ padding: 4, boxShadow: 6 }}>
            <Typography variant='h6' >{item.title}</Typography>
              <Typography variant="h5" mt={2} ml={1} fontWeight={'bold'}>{item.value}</Typography>
             
            </Card>
          </Grid>
        ))}
        <Grid item md={12}>
          <Typography sx={{ mb: 2, ml: 2 ,fontWeight:"bold"}}>Participants</Typography>
          <Card sx={{ boxShadow: 6 }}>
            <Box sx={{ overflowX: 'auto' }}>
              <ParticipantsTable rows={analyticsData?.participantDetails||[]} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const CustomCircularProgress = ({ title, color1,color2,label1,label2,value1,value2 }) => (
  <Card sx={{ padding: 4, boxShadow: 6 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, position: 'relative' }}>
      <DonutChart color1={color1} color2={color2} label1={label1} label2={label2} value1={value1} value2={value2} />
    </Box>
  
  </Card>
);

const BarGraphComponent = ({ currentEvent ,analyticsData,id}) => {
  const graphDetails = analyticsData?.graphDetails  || null;
  const [timeFrame, setTimeFrame] = useState('week');
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

  const data = useMemo(() => {
    const selectedData = graphDetails[timeFrame] || { label: [], data: [] };
    return {
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
        data: selectedData.data
      }],
      options: {
        chart: { type: 'bar', height: 450 },
        plotOptions: { bar: { columnWidth: '25%' } },
        dataLabels: { enabled: false },
        xaxis: {
          categories: selectedData.label,
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
    };
  }, [timeFrame]);

  return (
    <Card sx={{ width: '100%', padding: 4, boxShadow: 6 }}>
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
              {currentEvent.eventStartDate || "-"} - {(currentEvent.eventEndDate || "-") + " " + (currentEvent?.timezone?.timezoneName || "Timezone")}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
  <Select value={timeFrame} onChange={handleChange} sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 } }}>
    <MenuItem value="week">This Week</MenuItem>
    <MenuItem value="lastWeek">Last Week</MenuItem>
    <MenuItem value="last12Week">Last 12 Weeks</MenuItem>
    <MenuItem value="month">This Month</MenuItem>
  </Select>
  <Button variant="contained" color="primary" sx={{ mx: { xs: 0, md: 1 }, mb: { xs: 1, md: 0 } }}  onClick={() => {

    handleCopy(id)}} >
    Copy Attendance Url
  </Button>
  <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mx: { xs: 0, md: 1 }, mb: { xs: 1, md: 0 } }}>
    Send Email
  </Button>
</Box>

      </Box>
      <Divider sx={{ my: 2 }} />
      <ReactApexChart options={data.options} series={data.series} type="bar" height={350} />
      <EmailModal open={modalOpen} onClose={handleCloseModal} participants={analyticsData?.participantDetails||[]}/>
    </Card>
  );
};




const DonutChart = ({color1,color2,label1,label2,value1,value2}) => {
  
    
  const values = [value1||0, value2||0]; // Actual values
  const total = values.reduce((a, b) => a + b, 0);
  const series = values.map(value => (value / total) * 100); // Convert values to percentages

  const options = {
    chart: {
      type: 'donut',
    },
    labels: [label1||'Value 1', label2||'Value 2'],
    colors: [color1||'#FF5733', color2||'#33FF57'], 
    plotOptions: {
      pie: {
        donut: {
          size: '80%', // Decrease the thickness of the donut
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
        
              fontWeight: 600,
              color: '#373d3f',
              offsetY: -10,
              formatter: function (val) {
                return val;
              },
            },
            value: {
              show: true,
              fontSize: '16px',
          
              fontWeight: 400,
              color: '#373d3f',
              offsetY: 16,
              formatter: function (val, { seriesIndex, w }) {
                return values[seriesIndex]; // Show actual values
              },
            },
            total: {
              show: true, // Show the total by default
              showAlways: true,
              label: 'Total',
              fontSize: '22px',
              fontWeight: 600,
              color: '#373d3f',
              formatter: function (w) {
                return total;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',

        color: '#000', 
      },
      y: {
        formatter: function (val, { seriesIndex }) {
          return `${values[seriesIndex]} (${val.toFixed(1)}%)`; // Show actual values and percentage
        },
      },
      fillSeriesColor: false, // Ensure background color remains white
      fixed: {
        enabled: false,
      },
    },
  };

  

  return (
    <div>
      <ReactApexChart options={options} series={series} type="donut" width="380" />
    </div>
  );
};


export default Analytics;
