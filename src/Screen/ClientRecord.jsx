import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography, Box
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Theme';
import APPBAR from '../Component/APPBAR';
import BaseUrl from '../Asset/BaseUrl';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(date);
};

const ClientTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/client-records`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <APPBAR />
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', mt: 2, p: 2 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>C/O</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>C/O Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Fee</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Paid</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Prop. FW</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>FW Done</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Prop. Report</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Delivery</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id} sx={{ '&:nth-of-type(even)': { bgcolor: theme.palette.grey[50] } }}>
                  <TableCell sx={{ padding: '8px' }}>{item.srNo}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{item.clientName}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{item.clientPhone}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{item.co}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{item.coPhone}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>
                    <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>View Location</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ padding: '8px', bgcolor: theme.palette.grey[100] }}>
                          <Typography variant="body2">Plot No: {item.plotNo}</Typography>
                          <Typography variant="body2">Street No: {item.streetNo}</Typography>
                          <Typography variant="body2">Sector/Block: {item.sector}</Typography>
                          <Typography variant="body2">Scheme: {item.scheme}</Typography>
                          <Typography variant="body2">Plot Size: {item.plotSize}</Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                  <TableCell sx={{ padding: '8px' }}>{item.testFee}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{formatDate(item.paidOn)}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{formatDate(item.proposedFieldWork)}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{formatDate(item.fieldWorkDone)}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{formatDate(item.proposedReportDate)}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>{formatDate(item.reportDelivery)}</TableCell>
                  <TableCell sx={{ padding: '8px' }}>
                    <IconButton color="primary">
                      <FaEdit />
                    </IconButton>
                    <IconButton color="error">
                      <FaTrash />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </ThemeProvider>
  );
};

export default ClientTable;
