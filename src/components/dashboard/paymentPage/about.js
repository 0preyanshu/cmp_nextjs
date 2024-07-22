'use client'
import React, { useState } from 'react';
import { Box, Button, Grid, TextField, RadioGroup, FormControlLabel, Radio, Typography, Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PaymentSummary from './payment-summary';
import './styles.css';

function AboutYou({ handleNext }) {
    const dispatch = useDispatch();
    const { isLoading, priceDetails } = useSelector((state) => state.payment);
    const [formData, setFormData] = useState({
        registrationFor: 'myself',
        numberOfAttendees: 1,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        coupon: ''
    });

    const [activeSection, setActiveSection] = useState(0);
    const [loading, setLoading] = useState(false);
    const currencyid = 1;  // Replace with the actual currency id
    const waitlist = false;  // Replace with the actual waitlist status
    const event = {
        eventId: 1,  // Replace with actual event id
        eventName: 'Certified ScrumMaster (CSM)',
        instructorName: 'Lorem Ipsum',
        classStartDate: '2022-12-08T13:00:00',
        classEndDate: '2022-12-09T22:00:00',
        timezoneShortName: 'IST',
        courseLogo: 'path/to/logo.png'  // Replace with the actual logo path
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleIncrement = () => {
        setFormData({
            ...formData,
            numberOfAttendees: formData.numberOfAttendees + 1
        });
    };

    const handleDecrement = () => {
        if (formData.numberOfAttendees > 1) {
            setFormData({
                ...formData,
                numberOfAttendees: formData.numberOfAttendees - 1
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNext();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className="card-container">
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Card className="main-card">
                        <Typography variant="h6" gutterBottom>Basic Information</Typography>
                        <RadioGroup name="registrationFor" value={formData.registrationFor} onChange={handleChange} row>
                            <FormControlLabel value="myself" control={<Radio />} label="Myself" />
                            <FormControlLabel value="someoneElse" control={<Radio />} label="Someone Else" />
                        </RadioGroup>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Button onClick={handleDecrement}>-</Button>
                            </Grid>
                            <Grid item>
                                <TextField
                                    type="number"
                                    name="numberOfAttendees"
                                    value={formData.numberOfAttendees}
                                    onChange={handleChange}
                                    inputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item>
                                <Button onClick={handleIncrement}>+</Button>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Buyer Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="phoneNumber"
                                    label="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Continue
                            </Button>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <PaymentSummary
                        data={formData}
                        setData={(key, value) => setFormData(prev => ({ ...prev, [key]: value }))}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        event={event}
                        loading={loading}
                        currencyid={currencyid}
                        waitlist={waitlist}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default AboutYou;
