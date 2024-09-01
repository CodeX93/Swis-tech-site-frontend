import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, IconButton, Grid, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BaseUrl from '../Asset/BaseUrl';

const AddRecordModal = ({ open, handleClose, length }) => {
  const today = new Date().toISOString().split('T')[0]; // Default date to today

  const [formData, setFormData] = useState({
    clientName: '',
    clientContactNo: '',
    coName: '',
    coPhone: '',
    plotNo: '',
    streetNo: '',
    sector: '',
    scheme: '',
    plotSize: '',
    fee: 25000,
    proposedDate: today,
    fwDoneOn: today,
    proposedReportDate: '',
    deliveryDate: '',
    fieldWorkDone: today,
    paidOn: today,
    reportDelivery: '',
    srNo: '',
    orderDate: today,  // Added OrderDate field
  });

  const [feedback, setFeedback] = useState({ open: false, message: '', severity: '' });
  const [isAvailable, setIsAvailable] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateProposedDates = (fwDoneOnDate) => {
    const fwDoneDate = new Date(fwDoneOnDate);
    if (isNaN(fwDoneDate.getTime())) return { proposedReportDate: '', deliveryDate: '' }; // Return empty if invalid date

    const proposedReportDate = new Date(fwDoneDate);
    proposedReportDate.setDate(fwDoneDate.getDate() + 12);

    const deliveryDate = new Date(proposedReportDate);
    deliveryDate.setDate(proposedReportDate.getDate() + 5); // Assuming delivery date is 5 days after proposed report date

    return {
      proposedReportDate: proposedReportDate.toISOString().split('T')[0], // Return date in YYYY-MM-DD format
      deliveryDate: deliveryDate.toISOString().split('T')[0],
    };
  };

  const handleFwDoneOnChange = (e) => {
    const { value } = e.target;
    const { proposedReportDate, deliveryDate } = calculateProposedDates(value);
    setFormData((prevData) => ({
      ...prevData,
      fwDoneOn: value,
      proposedReportDate: proposedReportDate,
      deliveryDate: deliveryDate,
    }));
  };

  const checkAvailability = async (date) => {
    const response = await fetch(`${BaseUrl}/api/pending-records/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fwDoneOn: date }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }

    const result = await response.json();
    return result.isAvailable; // assuming the API returns an object with isAvailable field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check availability for the proposed date
      const isAvailable = await checkAvailability(formData.fwDoneOn);
      console.log('Availability:', isAvailable); // Logging the result
  
      if (!isAvailable) {
        setFeedback({ open: true, message: 'Proposed date is not available.', severity: 'error' });
        return;
      }
  
      // If available, proceed with form submission
      const apiData = {
        clientName: formData.clientName,
        clientContactNo: formData.clientContactNo,
        coName: formData.coName || '-',
        coPhoneNumber: formData.coPhone || '-',
        plotNo: formData.plotNo,
        streetNo: formData.streetNo,
        sector: formData.sector,
        scheme: formData.scheme,
        plotSize: formData.plotSize,
        fee: formData.fee,
        proposedDate: formData.fwDoneOn,
        fwDoneOn: formData.fwDoneOn,
        proposedReportDate: formData.proposedReportDate,
        deliveryDate: formData.deliveryDate,
        fieldWorkDone: formData.fieldWorkDone,
        paidOn: formData.paidOn,
        reportDelivery: formData.reportDelivery,
        srNo: length + 1,
        orderDate: formData.orderDate, // Include OrderDate in the API request
      };
  
      const response = await fetch(`${BaseUrl}/api/pending-records/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add record');
      }
  
      const result = await response.json();
      console.log('Record added:', result);
  
      // Display success feedback
      setFeedback({ open: true, message: 'Record added successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error adding record:', error);
      // Display error feedback
      setFeedback({ open: true, message: 'Failed to add record.', severity: 'error' });
    }
  
    handleClose(); // Close modal after submission
  };
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-record-modal"
      aria-describedby="modal-to-add-new-record"
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Record
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Client Details Section */}
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Client Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client Name"
                  name="clientName"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client Contact No"
                  name="clientContactNo"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.clientContactNo}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="C/O Name (Optional)"
                  name="coName"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.coName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="C/O Phone (Optional)"
                  name="coPhone"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.coPhone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Plot Details Section */}
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Plot Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Plot No"
                  name="plotNo"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.plotNo}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street No"
                  name="streetNo"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.streetNo}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Block"
                  name="sector"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Scheme"
                  name="scheme"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.scheme}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Plot Size"
                  name="plotSize"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.plotSize}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Dates Section */}
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Dates
            </Typography>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                  label="Order Date"
                  name="orderDate"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.orderDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Field Work Done On"
                  name="fwDoneOn"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.fwDoneOn}
                  onChange={handleFwDoneOnChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Proposed Report Date"
                  name="proposedReportDate"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.proposedReportDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Delivery Date"
                  name="deliveryDate"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              
            </Grid>
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Record
          </Button>
        </form>

        {/* Feedback Snackbar */}
        <Snackbar
          open={feedback.open}
          autoHideDuration={6000}
          onClose={() => setFeedback({ ...feedback, open: false })}
        >
          <Alert
            onClose={() => setFeedback({ ...feedback, open: false })}
            severity={feedback.severity}
            sx={{ width: '100%' }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default AddRecordModal;
