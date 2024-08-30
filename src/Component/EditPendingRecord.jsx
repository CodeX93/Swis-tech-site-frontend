import React, { useEffect, useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, IconButton, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BaseUrl from '../Asset/BaseUrl';

const EditRecordModal = ({ open, handleClose, item, onSaveSuccess }) => {
  const today = new Date().toISOString().split('T')[0]; // Default date to today

  useEffect(() => {
  }, [item]);

  const [formData, setFormData] = useState({
    clientName: item.clientName || '',
    clientContactNo: item.clientContactNo || '',
    coName: item.coName || '',
    coPhone: item.coPhone || '',
    plotNo: item.plotNo || '',
    plotSize: item.plotSize || '',
    streetNo: item.streetNo || '',
    sector: item.sector || '',
    scheme: item.scheme || '',
    fee: item.fee || '',
    paidOn: item.paidOn ? new Date(item.paidOn).toISOString().split('T')[0] : today,
    proposedDate: item.proposedDate ? new Date(item.proposedDate).toISOString().split('T')[0] : today,
    fwDoneOn: item.fwDoneOn ? new Date(item.fwDoneOn).toISOString().split('T')[0] : today,
    proposedReportDate: item.proposedReportDate ? new Date(item.proposedReportDate).toISOString().split('T')[0] : today,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await handleSave(item._id, formData); // Pass the ID and updated data to the save function
      
      handleClose(); // Close modal after saving
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const handleSave = async (id, updatedData) => {
    const response = await fetch(`${BaseUrl}/api/pending-records/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to update record');
    }

    const result = await response.json();
    return result;
  };

  // Function to calculate proposed report date
  const calculateProposedReportDate = (fwDoneOnDate) => {
    const fwDoneDate = new Date(fwDoneOnDate);
    if (isNaN(fwDoneDate.getTime())) return ''; // Return empty if invalid date

    const proposedReportDate = new Date(fwDoneDate);
    proposedReportDate.setDate(fwDoneDate.getDate() + 12);
    
    return proposedReportDate.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  };

  const handleFwDoneOnChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      fwDoneOn: value,
      proposedReportDate: calculateProposedReportDate(value),
    }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-record-modal"
      aria-describedby="modal-to-edit-record"
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
          Edit Record
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Client Details Section */}
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Client Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
            </Grid>
          </Box>

          {/* Fee and Dates Section */}
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Fee and Dates
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Fee"
                  name="fee"
                  type="number"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.fee}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Paid On"
                  name="paidOn"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={formData.paidOn}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Proposed Date"
                  name="proposedDate"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={formData.proposedDate}
                  onChange={handleChange}
                  />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="FW Done On"
                      name="fwDoneOn"
                      type="date"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      value={formData.fwDoneOn}
                      onChange={handleFwDoneOnChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Proposed Report Date"
                      name="proposedReportDate"
                      type="date"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      value={formData.proposedReportDate}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
    
              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Changes
              </Button>
            </form>
          </Box>
        </Modal>
      );
    };
    
    export default EditRecordModal;
    