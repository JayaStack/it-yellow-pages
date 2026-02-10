import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { businessService, categoryService, subCategoryService } from '../services/api';
import { Plus, Info, MapPin, Phone, Globe, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

const SubmitBusiness = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCatLoading, setSubCatLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    area: '',
    city: 'Madurai',
    state: 'Tamil Nadu',
    zip: '',
    phoneNumbers: [''],
    email: '',
    website: '',
    category: '',
    subCategory: '',
    images: ['']
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/submit-business' } });
    }
    
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [user, navigate]);

  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setFormData({ ...formData, category: catId, subCategory: '' });
    setSubCategories([]);
    
    if (catId) {
      setSubCatLoading(true);
      try {
        const { data } = await subCategoryService.getByCategory(catId);
        setSubCategories(data);
      } catch (err) {
        console.error('Failed to fetch subcategories');
      } finally {
        setSubCatLoading(false);
      }
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index] = value;
    setFormData({ ...formData, phoneNumbers: newPhones });
  };

  const addPhone = () => setFormData({ ...formData, phoneNumbers: [...formData.phoneNumbers, ''] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.subCategory) {
      setError('Please select both Category and Sub-category');
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Filter out empty phones and images
      const submitData = {
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter(p => p.trim() !== ''),
        images: formData.images.filter(i => i.trim() !== '')
      };
      await businessService.create(submitData);
      setSuccess(true);
      window.scrollTo(0, 0);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit business. Check all fields.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Submission Successful!</h2>
          <p className="text-gray-600 mb-8">
            Your business listing has been submitted for review. Our moderates will approve it within 24-48 hours.
          </p>
          <div className="animate-pulse text-sm text-primary-dark font-bold">
            Redirecting to home page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">List Your Business</h1>
          <p className="text-gray-500 mt-2">Fill out the form below to showcase your business to thousands of potential customers.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2 border border-red-100">
            <Info size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-primary-dark" /> General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Business Name*</label>
                <input
                  required
                  type="text"
                  className="input-field"
                  placeholder="e.g. S.S. Hospital Equipments"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Description*</label>
                <textarea
                  required
                  className="input-field min-h-[120px]"
                  placeholder="Tell us about your services, products, and specialties..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Category*</label>
                <select
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Sub-Category*</label>
                <select
                  required
                  disabled={!formData.category || subCatLoading}
                  className={`input-field ${(!formData.category || subCatLoading) ? 'bg-gray-100 opacity-50 cursor-not-allowed' : ''}`}
                  value={formData.subCategory}
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                >
                  <option value="">{subCatLoading ? 'Loading...' : 'Select Sub-category'}</option>
                  {subCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                {!formData.category && <p className="text-[10px] text-gray-400 mt-1">Please select a category first</p>}
              </div>
            </div>
          </section>

          {/* Contact & Location */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-primary-dark" /> Contact & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Area / Locality*</label>
                <input
                  required
                  type="text"
                  className="input-field"
                  placeholder="e.g. Karimedu"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">City*</label>
                <input
                  required
                  type="text"
                  className="input-field"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Phone Numbers* (At least one)</label>
                {formData.phoneNumbers.map((phone, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      required={i === 0}
                      type="text"
                      className="input-field"
                      placeholder="e.g. 94429 56515"
                      value={phone}
                      onChange={(e) => handlePhoneChange(i, e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" onClick={addPhone} className="text-secondary text-sm font-bold flex items-center gap-1 mt-2 hover:text-primary-dark">
                  <Plus size={16} /> Add another phone
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="contact@business.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Website URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://www.yoursite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="text-primary-dark" /> Photos & Logo
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Image URL (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.images[0]}
                  onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-white font-bold py-4 px-12 rounded-xl hover:bg-black transition-all shadow-xl flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Listing for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitBusiness;
