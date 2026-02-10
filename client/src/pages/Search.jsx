import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Phone, Globe, Mail } from 'lucide-react';
import { businessService, categoryService } from '../services/api';
import { getCategoryIcon } from '../utils/categoryIcons';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({ pages: 1, count: 0 });

  const keyword = searchParams.get('keyword') || '';
  const city = searchParams.get('city') || '';
  const categoryId = searchParams.get('category') || '';
  const page = searchParams.get('pageNumber') || 1;

  useEffect(() => {
    document.title = `Search Results | ${keyword || 'All Categories'} - IT Yellow Pages`;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bizRes, catRes] = await Promise.all([
          businessService.getAll({ keyword, city, category: categoryId, pageNumber: page }),
          categoryService.getAll()
        ]);
        setBusinesses(bizRes.data.businesses);
        setMetadata({ pages: bizRes.data.pages, count: bizRes.data.count });
        setCategories(catRes.data);
      } catch (err) {
        console.error('Search API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [keyword, city, categoryId, page]);

  const updateSearch = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    setSearchParams(nextParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search business..."
              className="w-full bg-gray-50 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary"
              defaultValue={keyword}
              onKeyDown={(e) => e.key === 'Enter' && updateSearch({ keyword: e.target.value })}
            />
          </div>
          <div className="md:w-64 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Location"
              className="w-full bg-gray-50 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary"
              defaultValue={city}
              onKeyDown={(e) => e.key === 'Enter' && updateSearch({ city: e.target.value })}
            />
          </div>
          <button className="btn-primary flex items-center justify-center gap-2 md:w-32">
            Search
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Filter size={20} className="text-primary-dark" />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-secondary">By Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateSearch({ category: '' })}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${!categoryId ? 'bg-primary/20 text-secondary font-bold' : 'hover:bg-gray-50'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => {
                    const Icon = getCategoryIcon(cat.icon);
                    return (
                      <button
                        key={cat._id}
                        onClick={() => updateSearch({ category: cat._id })}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition-colors ${categoryId === cat._id ? 'bg-primary/20 text-secondary font-bold' : 'hover:bg-gray-50'}`}
                      >
                        <Icon size={16} />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 text-center">
              <h3 className="font-bold mb-2">Not listed yet?</h3>
              <p className="text-sm text-gray-600 mb-4">Add your business to our directory and reach thousands of customers.</p>
              <Link to="/submit-business" className="bg-secondary text-white text-sm font-bold py-2 px-4 rounded block hover:bg-black transition-colors">
                List Your Business
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary">
                {loading ? 'Searching...' : `${metadata.count} results found`}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <SlidersHorizontal size={16} />
                <span>Sort by: Featured First</span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white h-48 rounded-xl animate-pulse shadow-sm"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {businesses.map(biz => (
                  <div key={biz._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 border border-gray-100 relative group">
                    {biz.isFeatured && (
                      <div className="absolute top-0 left-0 bg-primary text-secondary text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl shadow-sm">
                        PREMIUM
                      </div>
                    )}
                    
                    <div className="md:w-56 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={biz.images[0] || 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=400'}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/business/${biz._id}`}>
                          <h3 className="text-2xl font-bold text-secondary hover:text-primary-dark transition-colors">{biz.name}</h3>
                        </Link>
                        <div className="flex items-center bg-green-50 px-2 py-1 rounded text-green-700 text-sm font-bold border border-green-100">
                          <span className="text-lg">★</span> {biz.rating || 0}
                        </div>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm mb-4 gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} className="text-primary-dark" />
                          {biz.address.area}, {biz.address.city}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {biz.category?.name}
                        </span>
                      </div>

                      <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed">
                        {biz.description}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {biz.phoneNumbers[0] && (
                          <a href={`tel:${biz.phoneNumbers[0]}`} className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors">
                            <Phone size={16} /> Call Now
                          </a>
                        )}
                        <Link to={`/business/${biz._id}`} className="bg-primary text-secondary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {businesses.length === 0 && (
                  <div className="bg-white p-12 rounded-xl text-center shadow-sm">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SearchIcon size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No businesses found</h3>
                    <p className="text-gray-500">Try adjusting your keyword or category filters.</p>
                  </div>
                )}

                {/* Pagination */}
                {metadata.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      disabled={page <= 1}
                      onClick={() => updateSearch({ pageNumber: Number(page) - 1 })}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {[...Array(metadata.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateSearch({ pageNumber: i + 1 })}
                        className={`w-10 h-10 rounded-lg border font-bold ${Number(page) === i + 1 ? 'bg-primary border-primary' : 'hover:bg-gray-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page >= metadata.pages}
                      onClick={() => updateSearch({ pageNumber: Number(page) + 1 })}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
