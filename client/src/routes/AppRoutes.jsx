import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SearchResults from '../pages/Search';
import BusinessDetail from '../pages/BusinessDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SubmitBusiness from '../pages/SubmitBusiness';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/business/:id" element={<BusinessDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/submit-business" element={<SubmitBusiness />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
