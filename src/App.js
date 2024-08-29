import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import APPBAR from './Component/APPBAR'; // Adjust the path as necessary

import PendingOrders from './Screen/PendingRecord';
import CompletedOrders from './Screen/ClientRecord';
import Dashboard from './Screen/Dashboard';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
        <Route path="/completed-orders" element={<CompletedOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
