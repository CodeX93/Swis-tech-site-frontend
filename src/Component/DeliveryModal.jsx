import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, IconButton, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import BaseUrl from '../Asset/BaseUrl';

const DeliveryModal = ({ open, handleClose, handleConfirm, item ,length}) => {
  const today = format(new Date(), 'yyyy-MM-dd'); // Default date to today


  const [formData, setFormData] = useState({
    
    deliveryDate: item.deliveryDate || today, // Initialize with today's date if not provided
    srNo: item.srNo || '',
    clientName: item.clientName || '',
    clientPhone: item.clientContactNo || '',
    co: item.coName || '',
    coPhone: item.coPhoneNumber || '',
    plotNo: item.plotNo || '',
    streetNo: item.streetNo || '',
    sector: item.sector || '',
    scheme: item.scheme || '',
    plotSize: item.plotSize || '',
    testFee: item.fee || '',
    paidOn: item.paidOn || '',
    proposedFieldWork: item.proposedDate || '',
    fieldWorkDone: item.fwDoneOn || '',
    proposedReportDate: item.proposedReportDate || '',
    reportDelivery: item.reportDelivery || today
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${BaseUrl}/api/pending-records/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Record deleted successfully');
        
        handleClose(); // Close modal after deletion
      } else {
        console.error('Failed to delete record:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(item)
    console.log(formData)
    
    try {
      
      const response = await fetch(`${BaseUrl}/api/client-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data saved successfully');
        handleDeleteClick(item._id)
        handleConfirm(); // Call the confirm handler if needed
        handleClose(); // Close modal after submission
      } else {
        console.error('Failed to save data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };





  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delivery-modal-title"
      aria-describedby="modal-to-verify-delivery"
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
          Verify Delivery
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Delivery Details Section */}
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Delivery Details
            </Typography>
            <Grid container spacing={2}>
             
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Report Delivery"
                  name="reportDelivery"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={formData.reportDelivery}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Confirm
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default DeliveryModal;
