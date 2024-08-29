import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format } from 'date-fns';
import BaseUrl from '../Asset/BaseUrl';

const ThisWeekSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch schedule data for this week
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/pending-records/schedule`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        setError('Failed to fetch schedule data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

  return (
    <Box p={3} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
      <Typography variant="h6" gutterBottom>
        This Week's Schedule
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SR No</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleData.map((item) => (
              <TableRow key={item.srNo}>
                <TableCell>{item.srNo}</TableCell>
                <TableCell>{item.clientName}</TableCell>
                <TableCell>
                  {item.plotNo || 'N/A'}, {item.streetNo || 'N/A'}, {item.sector || 'N/A'}, {item.scheme || 'N/A'}
                </TableCell>
                <TableCell>{format(new Date(item.proposedDate), 'EEEE')}</TableCell>
                <TableCell>{format(new Date(item.proposedDate), 'dd MMM yyyy')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ThisWeekSchedule;
