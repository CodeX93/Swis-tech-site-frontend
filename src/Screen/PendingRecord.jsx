import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Button, Typography, Tooltip
} from '@mui/material';
import { FaEdit, FaTrash, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Theme';
import APPBAR from '../Component/APPBAR';
import AddRecordModal from '../Component/AddRecordModal';
import EditRecordModal from '../Component/EditPendingRecord';
import DeliveryModal from '../Component/DeliveryModal'; // Import the DeliveryModal
import { format } from 'date-fns';
import BaseUrl from '../Asset/BaseUrl';

const formatDate = (date) => {
  if (date === null) {
    return 'No date';
  }
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return format(date, 'dd-MM-yy');
};

const PendingWorks = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/pending-records/`);
        const result = await response.json();
  
        // Sort the result by orderDate
        const sortedData = result.sort((a, b) => {
          const dateA = new Date(a.orderDate);
          const dateB = new Date(b.orderDate);
          return dateA - dateB; // Earliest date first
        });
  
        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []); // Note: Removed `data` from the dependency array to avoid infinite re-fetching

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.key === 'A') {
        setModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedItem({});
  };

  const handleOpenDeliveryModal = (item) => {
    setSelectedItem(item);
    setDeliveryModalOpen(true);
  };
  
  const handleCloseDeliveryModal = () => setDeliveryModalOpen(false);
  
  const handleConfirmDelivery = () => {
    console.log('Delivery confirmed.');
    handleCloseDeliveryModal();
  };

  const handleSave = (updatedItem) => {
    console.log('Updated item');
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${BaseUrl}/api/pending-records/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Record marked completed Successfully.')
        window.location.reload();
      } else {
        console.error('Failed to delete record:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <APPBAR />
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>Pending Works</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus />}
            sx={{ mb: 2 }}
            onClick={handleOpenModal}
          >
            Add New Work
          </Button>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', p: 2 }}>
            <Table stickyHeader aria-label="pending works table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>Ord. Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>Client Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>C/O Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>C/O Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>FW Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '12px', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item._id} sx={{ '&:nth-of-type(even)': { bgcolor: theme.palette.grey[50] }, '&:hover': { bgcolor: theme.palette.grey[100] } }}>
                    <TableCell sx={{ padding: '12px', textAlign: 'center' }}>{index + 1}</TableCell>
                    <TableCell sx={{ padding: '12px', textAlign: 'center' }}>{formatDate(item.orderDate)}</TableCell>
                    <TableCell sx={{ padding: '12px' }}>
                      Plot No: {item.plotNo}, Street No: {item.streetNo}, Sector/Block: {item.sector}, Scheme: {item.scheme}
                    </TableCell>
                    <TableCell sx={{ padding: '12px' }}>{item.clientName}</TableCell>
                    <TableCell sx={{ padding: '12px' }}>{item.clientContactNo}</TableCell>
                    <TableCell sx={{ padding: '12px' }}>{item.coName}</TableCell>
                    <TableCell sx={{ padding: '12px' }}>{item.coPhoneNumber}</TableCell>
                    <TableCell sx={{ padding: '12px' }}>{formatDate(item.proposedDate)}</TableCell>
                    <TableCell sx={{ padding: '12px', textAlign: 'center' }}>
                      <Tooltip title="Confirm Delivery" arrow>
                        <IconButton color="primary" onClick={() => handleOpenDeliveryModal(item)}>
                          <FaCheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Record" arrow>
                        <IconButton color="primary" onClick={() => handleOpenEditModal(item)}>
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Record" arrow>
                        <IconButton color="error" onClick={() => handleDeleteClick(item._id)}>
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <AddRecordModal open={modalOpen} handleClose={handleCloseModal} length={data.length} />
        {editModalOpen && selectedItem && (
          <EditRecordModal
            open={editModalOpen}
            handleClose={handleCloseEditModal}
            item={selectedItem}
            handleSave={handleSave}
          />
        )}
        {deliveryModalOpen && selectedItem && (
          <DeliveryModal
            open={deliveryModalOpen}
            handleClose={handleCloseDeliveryModal}
            handleConfirm={handleConfirmDelivery}
            item={selectedItem}
            length={data.length}
          />
        )}
      </>
    </ThemeProvider>
  );
};

export default PendingWorks;
