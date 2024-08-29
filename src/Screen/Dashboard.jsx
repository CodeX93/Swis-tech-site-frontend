import React from 'react';
import ThisWeekSchedule from '../Component/ThisWeekSchedule';
import UpcomingReportDeliveryDeadline from '../Component/UpcomingReportDeliveryDeadline';
import PendingPaymentTotal from '../Component/PendingPaymentTotal';
import { ThemeProvider } from '@emotion/react';
import APPBAR from '../Component/APPBAR';
import { Container, Grid, Card, CardContent, Box } from '@mui/material';

import theme from '../Theme';

const Dashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <>
        <APPBAR />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <ThisWeekSchedule />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <UpcomingReportDeliveryDeadline />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <PendingPaymentTotal />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </>
    </ThemeProvider>
  );
};

export default Dashboard;
