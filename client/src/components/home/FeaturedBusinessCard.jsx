import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";

const FeaturedBusinessCard = React.memo(({ biz }) => {
  const image =
    biz?.images?.[0] ||
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=400";
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:translate-y-[-8px] transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={biz?.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-primary text-secondary px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
          FEATURED
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded text-xs font-semibold text-secondary">
          {biz?.category?.name}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary-dark transition-colors">
          {biz?.name}
        </h3>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1 text-primary-dark" />
          {biz?.address?.area}, {biz?.address?.city}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="font-bold text-secondary">{biz?.rating || 0}</span>
            <span className="text-gray-400 text-sm ml-1">
              ({biz?.numReviews || 0})
            </span>
          </div>
          <Link
            to={`/business/${biz?._id}`}
            className="text-secondary font-bold hover:text-primary-dark flex items-center gap-1 group/btn"
          >
            Details{" "}
            <ChevronRight
              size={16}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
});

export default FeaturedBusinessCard;
