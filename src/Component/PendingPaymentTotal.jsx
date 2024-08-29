import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import BaseUrl from '../Asset/BaseUrl';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const DateTypography = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.primary.main,
}));

const StatusTypography = styled(Typography)(({ theme, available }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: available ? theme.palette.success.main : theme.palette.error.main,
}));

const PendingAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch availability data from API
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/pending-records/availability`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAvailabilityData(data);
      } catch (error) {
        setError('Failed to fetch availability data');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  return (
    <Box p={3} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
      <Typography variant="h6" gutterBottom>
        Availability Slots (Next 15 Days)
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(availabilityData).map((date) => (
          <Grid item xs={12} sm={6} md={4} key={date}>
            <StyledCard>
              <CardContent>
                <DateTypography variant="h6">{date}</DateTypography>
                <Typography variant="subtitle1" color="textSecondary">
                  {getDayName(date)}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <StatusTypography variant="body1" available={availabilityData[date].count < 3}>
                  {availabilityData[date].count < 3 ? <CheckIcon /> : <CloseIcon />}
                  
                  
                </StatusTypography>
                <Typography variant="body2" color="textSecondary">
                  {availabilityData[date].count} / 3 slots filled
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PendingAvailability;
