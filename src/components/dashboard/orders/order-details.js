'use client';
import React, { use, useState } from 'react';
import { 
  Box, Button, Tooltip, Typography, Stack, Tab, Tabs, Table, TableBody, TableCell, TableHead, TableRow, Divider, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, Select, MenuItem, Grid, InputLabel 
} from '@mui/material';
import { Icon } from '@iconify/react';
import { BuyerTable } from '@/components/dashboard/orders/buyer-table';
import { ParticipantsTable } from '@/components/dashboard/orders/participants-table';
import { PaymentDetailsTable } from '@/components/dashboard/orders/payment-details-table';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { current } from '@reduxjs/toolkit';
import  {formatDateTime} from '@/utils/formatTime';

function OrderDetails() {
    const router = useRouter();
    const { allOrders} = useSelector((state) => state?.orders?.orders);
  
    const[currentOrder,setCurrentOrder]=useState(null); 

    const {Id} = useParams();

    React.useEffect(()=>{
      console.log("allOrders",allOrders);
      console.log("id",Id);
        if(allOrders && Id){
            const details=allOrders.find((order)=>order.id===Id);
            console.log("order",details);
            setCurrentOrder(details);

        }
    }
    ,[allOrders,Id]);






  const order = {
    id: currentOrder?.id.slice(-3)||"-",
    eventName: currentOrder?.event?.eventName||"-",
    course: currentOrder?.course?.courseName||"-",
    startDate: formatDateTime(currentOrder?.event?.eventStartDate)||"-",
    totalParticipants: currentOrder?.participants?.length||"-",
    subTotal: currentOrder?.orderInfo?.totalAmount-(currentOrder?.orderInfo?.feesAmount+currentOrder?.orderInfo?.taxAmount),
    fees: currentOrder?.orderInfo?.feesAmount,
    tax: currentOrder?.orderInfo?.taxAmount,
    total: currentOrder?.orderInfo?.totalAmount,
  };

  const [tabValue, setTabValue] = useState(0);
  const [openRefund, setOpenRefund] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [sendEmail, setSendEmail] = useState('Yes');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenRefund = () => {
    setOpenRefund(true);
  };

  const handleCloseRefund = () => {
    setOpenRefund(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteOrder = () => {
    // Handle the delete action here
    console.log(`Order ${order.id} deleted`);
    setOpenDelete(false);
  };

  return (
    <Box p={2}>
      <Grid container spacing={1} mb={5} mt={3}>
        <Grid item md={3} lg={1}>
          <Tooltip title="Edit">
            <Button variant="outlined" startIcon={<Icon icon="eva:edit-fill" />} onClick={()=>{
                router.push(paths.dashboard.orders.edit(currentOrder.id));
            }}>
              Edit
            </Button>
          </Tooltip>
        </Grid>
    
        <Grid item md={3} lg={1.3}>
          <Tooltip title="Cancel">
            <Button variant="outlined" startIcon={<Icon icon="line-md:cancel-twotone" />} onClick={()=>{
                router.push(paths.dashboard.orders.cancel(currentOrder.id));
            }}>
              Cancel
            </Button>
          </Tooltip>
        </Grid>
        <Grid item md={3} lg={1.3}>
          <Tooltip title="Invoice">
            <Button variant="outlined" startIcon={<Icon icon="la:file-invoice" />} onClick={()=>{
                router.push(paths.dashboard.orders.invoice(currentOrder.id));
            }}>
              Invoice
            </Button>
          </Tooltip>
        </Grid>
        <Grid item md={3} lg={1.3}>
          <Tooltip title="History">
            <Button variant="outlined" startIcon={<Icon icon="material-symbols:history" />} onClick={()=>{
                router.push(paths.dashboard.orders.history(currentOrder.id));
            
            }}>
              History
            </Button>
          </Tooltip>
        </Grid>
        <Grid item md={3} lg={1.3}>
          <Tooltip title="Emails">
            <Button variant="outlined" startIcon={<Icon icon="eva:email-outline" />} onClick={()=>{
                router.push(paths.dashboard.orders.email(currentOrder.id));
            }}>
              Emails
            </Button>
          </Tooltip>
        </Grid>
        <Grid item md={3} lg={1.3}>
          <Tooltip title="Refund">
            <Button variant="outlined" startIcon={<Icon icon="mdi:cash-refund" />} onClick={handleOpenRefund}>
              Refund
            </Button>
          </Tooltip>
        </Grid>
        <Grid item md={3} lg={1.3}>
          <Tooltip title="Delete">
            <Button variant="outlined" color="error" startIcon={<Icon icon="material-symbols:delete" />} onClick={handleOpenDelete}>
              Delete
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Card sx={{ overflowX: "auto" }}>
        <CardContent sx={{ p: 0, borderRadius: 0, minWidth: "550px" }}>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ml: 3 }}>#</TableCell>
                <TableCell>Event Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Total Participants</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.eventName}</TableCell>
                <TableCell>{order.course}</TableCell>
                <TableCell>{order.startDate}</TableCell>
                <TableCell>{order.totalParticipants}</TableCell>
                <Divider sx={{ my: 2 }} />
              </TableRow>
            </TableBody>
          </Table>

          <Stack direction="column" alignItems="flex-end" spacing={1} sx={{ mr: 8 }}>
            <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
              <Typography variant="h6" align="left" sx={{ flex: 1 }}>
                SubTotal:
              </Typography>
              <Typography align="left">{order.subTotal} USD</Typography>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
              <Typography variant="h6" align="left" sx={{ flex: 1 }}>
                Fees:
              </Typography>
              <Typography align="left">{order.fees} USD</Typography>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
              <Typography variant="h6" align="left" sx={{ flex: 1 }}>
                Tax:
              </Typography>
              <Typography color="error" align="left">
                {order.tax} USD
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
              <Typography variant="h6" align="left" sx={{ flex: 1 }}>
                Total:
              </Typography>
              <Typography align="left">{order.total} USD</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2 }}>
        <Tab label="Buyer" />
        <Tab label="Participants" />
        <Tab label="Payment Details" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <Box sx={{ overflowX: "auto" }}>
            <BuyerTable rows={currentOrder?.participants[0] ?[currentOrder?.participants[0]] : []}></BuyerTable>
          </Box>
        </Card>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
       
        <Card>
          <Box sx={{ overflowX: "auto" }}>
          <ParticipantsTable rows={currentOrder?.participants||[]} />
          </Box>
        </Card>

      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Card>
          <Box sx={{ overflowX: "auto" }}>
            <PaymentDetailsTable rows={currentOrder?.orderInfo ?[currentOrder?.orderInfo]:[]} paymentDate = {currentOrder?.createdAt||"-"}/>
          </Box>
        </Card>
      </TabPanel>

      {/* Refund Modal */}
      <Dialog open={openRefund} onClose={handleCloseRefund}>
        <DialogTitle sx={{ mt: 2 }}>Refund Order: {order.id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                label="Amount"
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Send Email</InputLabel>
                <Select
                  value={sendEmail}
                  onChange={(e) => setSendEmail(e.target.value)}
                  label="Send Email"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Send Email
                  </MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Customer Note"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Admin Note"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRefund}>Cancel</Button>
          <Button variant="contained" color="primary">Refund</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDeleteOrder} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



export default OrderDetails;

