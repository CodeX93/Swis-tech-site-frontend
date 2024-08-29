import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format } from 'date-fns';
import BaseUrl from "../Asset/BaseUrl"

const UpcomingReportDeliveryDeadline = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/pending-records/next-seven-days-deliveries`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Fetched data:', result);
        setData(result);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  // Filter data for the next seven days
  const upcomingData = data.filter((item) => {
    const proposedDate = new Date(item.proposedReportDate); // Adjust if necessary
    return !isNaN(proposedDate) && proposedDate >= today && proposedDate <= endOfWeek;
  });

  return (
    <Box p={3} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
      <Typography variant="h6" gutterBottom>
        Report Deliveries for the Next Seven Days
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SR No</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upcomingData.map((item) => (
                <TableRow key={item.srNo}>
                  <TableCell>{item.srNo}</TableCell>
                  <TableCell>{item.clientName}</TableCell>
                  <TableCell>{format(new Date(item.proposedReportDate), 'EEEE')}</TableCell>
                  <TableCell>{format(new Date(item.proposedReportDate), 'dd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UpcomingReportDeliveryDeadline;
