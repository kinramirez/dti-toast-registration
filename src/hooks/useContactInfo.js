import { useState, useCallback } from "react";
import apiClient from "@/api/client";

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContactInfo = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/settings/contact-info");
      setContactInfo(res.data.data || null);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  return {
    contactInfo,
    loading,
    error,
    fetchContactInfo,
  };
};

export default useContactInfo;