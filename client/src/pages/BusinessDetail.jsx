import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Clock, ChevronRight, Share2, Printer, Flag, CheckCircle2, Star } from 'lucide-react';
import { businessService } from '../services/api';

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await businessService.getById(id);
        setBusiness(data);
        document.title = `${data.name} | ${data.address.city} - IT Yellow Pages`;
      } catch (err) {
        setError('Business details could not be found or there was a server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="h-64 bg-secondary/50 animate-pulse"></div>
        <div className="container mx-auto px-4 -mt-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="flex-1 space-y-4">
                <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
            <div className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md border border-gray-100">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-red-300" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">{error || 'Business Not Found'}</h2>
          <p className="text-gray-500 mb-8">The business you are looking for might have been removed or the link is incorrect.</p>
          <Link to="/search" className="btn-primary inline-flex">Go to Listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Link to="/" className="hover:text-primary-dark">Home</Link>
            <ChevronRight size={14} />
            <Link to="/search" className="hover:text-primary-dark">Businesses</Link>
            <ChevronRight size={14} />
            <span className="text-secondary font-medium">{business.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-secondary text-white py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex-shrink-0 flex items-center justify-center p-4">
              {business.logo ? (
                <img src={business.logo} alt={business.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-4xl font-bold text-primary-dark">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{business.name}</h1>
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <CheckCircle2 size={12} /> VERIFIED
                </span>
              </div>
              
              <div className="flex flex-wrap gap-6 text-gray-300 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <MapPin size={18} className="text-primary" />
                  {business.address.area}, {business.address.city}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} fill={i < Math.floor(business.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="font-bold text-white">{business.rating || 0}</span>
                  <span>({business.numReviews || 0} Reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={18} className="text-primary" />
                  <span>Open Now</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {business.phoneNumbers[0] && (
                  <a href={`tel:${business.phoneNumbers[0]}`} className="bg-primary text-secondary px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center gap-2">
                    <Phone size={20} /> Call Now
                  </a>
                )}
                <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-bold transition-colors border border-white/20 flex items-center gap-2">
                  <Mail size={20} /> Send Inquiry
                </button>
              </div>
            </div>

            <div className="md:w-64 bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider font-bold">Actions</p>
                <div className="flex justify-around">
                  <button className="flex flex-col items-center gap-2 hover:text-primary transition-colors">
                    <div className="p-3 bg-white/10 rounded-full"><Share2 size={20} /></div>
                    <span className="text-xs">Share</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 hover:text-primary transition-colors">
                    <div className="p-3 bg-white/10 rounded-full"><Printer size={20} /></div>
                    <span className="text-xs">Print</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 hover:text-red-400 transition-colors">
                    <div className="p-3 bg-white/10 rounded-full"><Flag size={20} /></div>
                    <span className="text-xs">Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Column */}
          <div className="lg:w-2/3 space-y-8">
            {/* Gallery */}
            {business.images && business.images.length > 0 && (
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {business.images.map((img, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden bg-gray-100 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                      <img src={img} alt={`${business.name} ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">About the Business</h2>
              <div className="prose prose-yellow max-w-none text-gray-600">
                {business.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Listing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-500">Category:</span>
                  <span className="font-semibold text-secondary">{business.category?.name}</span>
                </div>
                {business.subCategory && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-500">Sub-Category:</span>
                    <span className="font-semibold text-secondary">{business.subCategory.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-500">Listing Status:</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Approved</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-500">Member Since:</span>
                  <span className="font-semibold text-secondary">{new Date(business.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-xl font-bold mb-6 text-secondary">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-gray-50 p-3 rounded-full text-primary-dark"><MapPin size={24} /></div>
                  <div>
                    <h4 className="font-bold text-sm text-secondary mb-1">Our Location</h4>
                    <p className="text-sm text-gray-500">
                      {business.address.street},<br />
                      {business.address.area},<br />
                      {business.address.city}, {business.address.zip}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-gray-50 p-3 rounded-full text-primary-dark"><Phone size={24} /></div>
                  <div>
                    <h4 className="font-bold text-sm text-secondary mb-1">Phone Numbers</h4>
                    {business.phoneNumbers.map((num, i) => (
                      <p key={i} className="text-sm text-gray-500">{num}</p>
                    ))}
                  </div>
                </div>

                {business.email && (
                  <div className="flex gap-4">
                    <div className="bg-gray-50 p-3 rounded-full text-primary-dark"><Mail size={24} /></div>
                    <div>
                      <h4 className="font-bold text-sm text-secondary mb-1">Email Us</h4>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{business.email}</p>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="flex gap-4">
                    <div className="bg-gray-50 p-3 rounded-full text-primary-dark"><Globe size={24} /></div>
                    <div>
                      <h4 className="font-bold text-sm text-secondary mb-1">Official Website</h4>
                      <a href={business.website} target="_blank" rel="noreferrer" className="text-sm text-primary-dark hover:underline font-medium">Visit Website</a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <Link to="/submit-business" className="w-full btn-secondary text-center block">
                  Post Your Listing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
