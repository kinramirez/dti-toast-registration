import { useState, useCallback } from "react";
import apiClient from "@/api/client";

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitContact = useCallback(async ({ fullName, email, subject, message }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/contact", {
        fullName,
        email,
        subject,
        message,
      });
      return res.data.data || null;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    submitContact,
  };
};

export default useContact;