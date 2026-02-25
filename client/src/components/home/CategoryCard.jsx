import React from "react";
import { Link } from "react-router-dom";
import { getCategoryIcon } from "../../utils/categoryIcons";

const CategoryCard = React.memo(({ category }) => {
  const Icon = getCategoryIcon(category?.icon);
  return (
    <Link
      to={`/search?category=${category?._id}`}
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all text-center border border-gray-100 group"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
        <Icon
          className="text-primary-dark group-hover:text-secondary"
          size={32}
        />
      </div>
      <h3 className="font-bold text-secondary group-hover:text-primary-dark">
        {category?.name}
      </h3>
    </Link>
  );
});

export default CategoryCard;
