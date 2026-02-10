import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Zap } from 'lucide-react';
import { businessService, categoryService } from '../services/api';
import { getCategoryIcon } from '../utils/categoryIcons';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Kumbakonam');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'IT Yellow Pages | Home - Local Business Directory';
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const catRes = await categoryService.getAll();
        setCategories(catRes.data);
        
        const busRes = await businessService.getAll({ featured: true });
        const featuredData = busRes.data.businesses || busRes.data;
        setFeaturedBusinesses(featuredData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${keyword}&city=${location}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Everything in <span className="text-primary">One Place</span>
          </h1>
          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Find the best local businesses, services, and professionals in your area. Trusted by thousands.
          </p>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full bg-white text-secondary py-4 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="md:w-64 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Location"
                className="w-full bg-white text-secondary py-4 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-primary text-secondary font-bold py-4 px-8 rounded-lg hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg">
              Search Now
            </button>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <span>Popular:</span>
            <Link to="/search?keyword=Web+Design" className="hover:text-primary underline">Web Design</Link>
            <Link to="/search?keyword=Catering" className="hover:text-primary underline">Catering</Link>
            <Link to="/search?keyword=Pest+Control" className="hover:text-primary underline">Pest Control</Link>
            <Link to="/search?keyword=Solar" className="hover:text-primary underline">Solar</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-secondary">Browse Categories</h2>
              <p className="text-gray-500 mt-2">Explore businesses by industry</p>
            </div>
            <Link to="/search" className="text-primary-dark font-semibold flex items-center hover:underline">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
              <span className="text-xl">⚠️</span> {error}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              ))
            ) : (
              categories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <Link
                    key={cat._id}
                    to={`/search?category=${cat._id}`}
                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all text-center border border-gray-100 group"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                      <Icon className="text-primary-dark group-hover:text-secondary" size={32} />
                    </div>
                    <h3 className="font-bold text-secondary group-hover:text-primary-dark">{cat.name}</h3>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Featured Experts</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Handpicked businesses known for their quality and excellence in services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="pt-4 flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredBusinesses.length > 0 ? featuredBusinesses.map((biz) => (
                <div key={biz._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:translate-y-[-8px] transition-all duration-300 border border-gray-100 overflow-hidden group">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={biz.images[0] || 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=400'}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-secondary px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                      FEATURED
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded text-xs font-semibold text-secondary">
                      {biz.category?.name}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary-dark transition-colors">
                      {biz.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin size={16} className="mr-1 text-primary-dark" />
                      {biz.address.area}, {biz.address.city}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="font-bold text-secondary">{biz.rating || 0}</span>
                        <span className="text-gray-400 text-sm ml-1">({biz.numReviews || 0})</span>
                      </div>
                      <Link to={`/business/${biz._id}`} className="text-secondary font-bold hover:text-primary-dark flex items-center gap-1 group/btn">
                        Details <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-16 text-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Zap size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-1">No featured listings found</h3>
                  <p className="text-gray-500 mb-6">Check back soon for handpicked businesses!</p>
                  <Link to="/search" className="btn-primary inline-flex">Explore All Businesses</Link>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">Are you a business owner?</h2>
          <p className="text-secondary/80 text-xl mb-10 max-w-2xl mx-auto">
            Get more customers by listing your business on Indian Yellow Pages. It only takes 2 minutes.
          </p>
          <Link to="/submit-business" className="bg-secondary text-white font-bold py-4 px-10 rounded-full hover:bg-secondary-dark transition-all shadow-xl inline-block">
            Register Your Business
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
