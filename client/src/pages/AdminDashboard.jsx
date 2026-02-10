import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { businessService } from '../services/api';
import { Check, X, ShieldAlert, Eye, Search, Filter, Trash2, Star } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchBusinesses();
  }, [user, navigate, filter]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      let res;
      if (filter === 'pending') {
        res = await businessService.getModerationList();
        setBusinesses(res.data);
      } else {
        res = await businessService.getAll({ pageNumber: 1 }); // Just get first page of approved
        setBusinesses(res.data.businesses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await businessService.updateStatus(id, { status });
      setBusinesses(businesses.filter(b => b._id !== id));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleFeaturedStatus = async (id, isFeatured) => {
    try {
      await businessService.updateStatus(id, { isFeatured });
      setBusinesses(businesses.map(b => b._id === id ? { ...b, isFeatured } : b));
    } catch (err) {
      alert('Error updating featured status');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
            <p className="text-gray-500">Manage business listings and moderation queue</p>
          </div>
          
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${filter === 'pending' ? 'bg-secondary text-white' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              Moderation Queue
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${filter === 'all' ? 'bg-secondary text-white' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              All Listings
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Business Details</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Owner</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading listings...</td>
                  </tr>
                ) : businesses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No listings found in this category.</td>
                  </tr>
                ) : businesses.map(biz => (
                  <tr key={biz._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center font-bold text-secondary">
                          {biz.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-secondary">{biz.name}</div>
                          <div className="text-xs text-gray-500">{biz.address.area}, {biz.address.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {biz.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{biz.owner?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{biz.owner?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${biz.status === 'approved' ? 'bg-green-500' : biz.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm capitalize font-medium">{biz.status}</span>
                      </div>
                      {biz.isFeatured && <div className="text-[10px] text-primary-dark font-bold mt-1">★ FEATURED</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {filter === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(biz._id, 'approved')}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors title='Approve'"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(biz._id, 'rejected')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors title='Reject'"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleFeaturedStatus(biz._id, !biz.isFeatured)}
                              className={`p-2 rounded-lg transition-colors ${biz.isFeatured ? 'bg-primary text-secondary' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                              title={biz.isFeatured ? 'Unmark Featured' : 'Mark Featured'}
                            >
                              <Star size={18} />
                            </button>
                            <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                              <Eye size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
