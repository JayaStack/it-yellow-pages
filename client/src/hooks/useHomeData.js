import { useState, useEffect, useRef, useCallback } from "react";
import { businessService, categoryService } from "../services/api";

export default function useHomeData() {
  const [data, setData] = useState({ categories: [], featuredBusinesses: [] });
  const [status, setStatus] = useState({ loading: true, error: null });
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setStatus({ loading: true, error: null });
    try {
      const [catRes, busRes] = await Promise.all([
        categoryService.getAll(),
        businessService.getAll({ featured: true }),
      ]);

      if (!mountedRef.current) return;

      const categories = catRes?.data || [];
      const featuredData = busRes?.data?.businesses || busRes?.data || [];

      setData({ categories, featuredBusinesses: featuredData });
      setStatus({ loading: false, error: null });
    } catch (err) {
      if (!mountedRef.current) return;
      setStatus({
        loading: false,
        error: "Failed to load data. Please try again later.",
      });
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return {
    categories: data.categories,
    featuredBusinesses: data.featuredBusinesses,
    loading: status.loading,
    error: status.error,
    refetch: fetchData,
  };
}
