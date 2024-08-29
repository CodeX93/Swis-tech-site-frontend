import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Button, Typography
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
    return 'No date'; // Return a default value or empty string if date is null
  }
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date'; // Or any default value you prefer
  }
  
  return format(date, 'dd-MM-yy'); // Format date as dd-MM-yy
};



const PendingWorks = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({}); // Initialize with an empty object
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false); // New state for DeliveryModal
  const [data, setData] = useState([]); // State to store fetched data

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/pending-records/`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data]); // Empty dependency array means this useEffect runs once when the component mounts

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
    
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedItem({}); // Clear selected item
  };

  const handleOpenDeliveryModal = (item) => {
    setSelectedItem(item); // Set the selected item
    setDeliveryModalOpen(true); // Open DeliveryModal
  };
  
  const handleCloseDeliveryModal = () => setDeliveryModalOpen(false); // Close DeliveryModal
  const handleConfirmDelivery = () => {
    console.log('Delivery confirmed.');
    handleCloseDeliveryModal(); // Close the modal after confirming
    
  };

  const handleSave = (updatedItem) => {
    console.log('Updated item:', updatedItem);
    // Implement save logic here, e.g., updating the item in state or backend
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
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Client Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>C/O Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>C/O Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>FW Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[200], padding: '8px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  
                  <TableRow key={item._id} sx={{ '&:nth-of-type(even)': { bgcolor: theme.palette.grey[50] } }}>
                    <TableCell sx={{ padding: '8px' }}>{index + 1}</TableCell>
                    <TableCell sx={{ padding: '8px' }}>
                      Plot No: {item.plotNo}, Street No: {item.streetNo}, Sector/Block: {item.sector}, Scheme: {item.scheme}
                    </TableCell>
                    <TableCell sx={{ padding: '8px' }}>{item.clientName}</TableCell>
                    <TableCell sx={{ padding: '8px' }}>{item.clientContactNo}</TableCell>
                    <TableCell sx={{ padding: '8px' }}>{item.coName}</TableCell>
                    <TableCell sx={{ padding: '8px' }}>{item.coPhoneNumber}</TableCell>
                    <TableCell sx={{ padding: '8px' }}>{formatDate(item.proposedDate)}</TableCell>

                    <TableCell sx={{ padding: '8px' }}>
                    <IconButton color="primary" onClick={() => handleOpenDeliveryModal(item)}>
  <FaCheckCircle />
</IconButton>

                      <IconButton color="primary" onClick={() => handleOpenEditModal(item)}>
                        <FaEdit />
                      </IconButton>
                      <IconButton color="error" onClick={()=>handleDeleteClick(item._id)}>
                        <FaTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <AddRecordModal open={modalOpen} handleClose={handleCloseModal}  length={data.length}/>
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
            item={selectedItem} // Pass the item to DeliveryModal
            length={data.length}
            
          />
        )}
      </>
    </ThemeProvider>
  );
};

export default PendingWorks;
