'use client'
import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Divider,Select,MenuItem,Button, Avatar, Card } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ReactApexChart from 'react-apexcharts';
import analytics from '@/redux/slices/analytics';
import {ParticipantsTable} from '@/components/dashboard/event-registration/participants-table';
import EmailModal from '@/components/dashboard/event-registration/emailmodal';


const Analytics = () => {
  const data = {
    totalRevenue: '211.21k',
    totalFees: 0,
    totalTax: 0,
    netProfit: '211.21k',
    orders: 1,
    participants: 1,
    abandonedParticipants: 0,
    waitlistParticipants: 0,
    cancelled: 0,
    refunded: 0,
    stripe: 0,
    paypal: 0,
  };



  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
        
        </Grid>
        <Grid item xs={12} sm={12} md={12} mb={5}>
            <BarGraphComponent />
        </Grid>

        <Grid item xs={12} sm={6} md={3} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h5" color="primary">
              {data.totalRevenue}
            </Typography>
            <Typography>Total Revenue</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h5" color="secondary">
              {data.totalFees}
            </Typography>
            <Typography>Total Fees</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h5" color="warning.main">
              {data.totalTax}
            </Typography>
            <Typography>Total Tax</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h5" color="error">
              {data.netProfit}
            </Typography>
            <Typography>Net Profit</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} mb={5}>
  <Paper sx={{ padding: 2 }}>
    <Typography variant="h6" gutterBottom>
      Orders
    </Typography>
    {/* <Divider /> */}
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, position: 'relative' }}>
      <CircularProgress variant="determinate" value={100} color="success" size={150} thickness={4} />
      <Box sx={{ position: 'absolute' }}>
        <Typography variant="h5" align="center">{data.orders}</Typography>
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
</Grid>

<Grid item xs={12} md={6} mb={5}>
  <Paper sx={{ padding: 2 }}>
    <Typography variant="h6" gutterBottom>
      Participants
    </Typography>
    {/* <Divider /> */}
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, position: 'relative' }}>
      <CircularProgress variant="determinate" value={100} color="error" size={150} thickness={4} />
      <Box sx={{ position: 'absolute' }}>
        <Typography variant="h5" align="center">{data.participants}</Typography>
        <Typography align="center">Total</Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
        <Box sx={{ width: 10, height: 10, backgroundColor: 'red', marginRight: 1 }} />
        <Typography>Internal</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 10, height: 10, backgroundColor: 'darkred', marginRight: 1 }} />
        <Typography>Vendors</Typography>
      </Box>
    </Box>
  </Paper>
</Grid>


        <Grid item xs={12} sm={6} md={4} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">{data.abandonedParticipants}</Typography>
            <Typography>Abandoned Participants</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">{data.waitlistParticipants}</Typography>
            <Typography>Waitlist Participants</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">{data.cancelled}</Typography>
            <Typography>Cancelled</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">{data.refunded}</Typography>
            <Typography>Refunded</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">{data.stripe}</Typography>
            <Typography>Stripe</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} mb={5}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">{data.paypal}</Typography>
            <Typography>Paypal</Typography>
          </Paper>
        </Grid>
        <Grid item md={12}>
        <Typography sx={{mb:2,ml:2}}>Participants</Typography>
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

export default Analytics;


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraphComponent = () => {
    const [timeFrame, setTimeFrame] = React.useState('Week');
  
    const handleChange = (event) => {
      setTimeFrame(event.target.value);
    };
  
const data = {
  chart: { animations: { enabled: true }, sparkline: { enabled: false } },
  stroke: { width: 2 },
  tooltip: {
    x: { show: false },
    y: {
      formatter: (seriesName) => fNumber(seriesName),
      title: {
        formatter: () => '',
      },
    },
    marker: { show: false },
  },
  series: [{
    name: 'Participants',
    data: [0, 1, 0, 0, 0, 0, 0]
  }],
  options: {
    chart: {
      type: 'bar',
      height: 450,
    },
    plotOptions: {
      bar: {
        columnWidth: '25%', // Adjust the bar width here
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['2024/06/19', '2024/06/20', '2024/06/21', '2024/06/22', '2024/06/23', '2024/06/24', '2024/06/25'],
    },
    yaxis: {
      tickAmount: 5, // Only 5 grid lines
      labels: {
        style: {
   
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: true,
     
      },
      axisTicks: {
        show: true,
      
      }
    },
    grid: {
      borderColor: '#e0e0e0', // Light grid lines
      strokeDashArray: 5, // Dotted grid lines
    },
    title: {
      text: 'Participants Over Time',
      align: 'center'
    },
  },
};
const [modalOpen, setModalOpen] = React.useState(false);

const handleOpenModal = () => {
  setModalOpen(true);
};

const handleCloseModal = () => {
  setModalOpen(false);
};
  
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
          <Avatar sx={{ mr: 1 }}></Avatar>
          <Box>
            <Typography variant="h7">CC</Typography>
            <Typography variant="subtitle2">
              21 Jun 2024 02:00 - 22 Jun 2024 06:25 Africa/Dakar
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
          <Button variant="contained" color="secondary" sx={{ mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 1 } }} onClick={handleOpenModal}>
            Send Joining Email
          </Button>
          <Button variant="contained" color="secondary">Copy Attendance URL</Button>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ width: '100%', height: 400 }}>
          <ReactApexChart options={data.options} series={data.series} type="bar" height={400} />
        </Box>
        <EmailModal open={modalOpen} onClose={handleCloseModal} />
      </Box>
    </Paper>


    
    );
  };
  


