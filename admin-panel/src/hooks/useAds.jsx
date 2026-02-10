import axios from "axios";
import { useState } from "react";
import { DB_URI } from "../utils/server-route";

const useAds = () => {
  const [loading, setLoading] = useState(false);

  const getAds = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${DB_URI}/ads`, { params });
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (payload) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${DB_URI}/ads`, payload);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAd = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(`${DB_URI}/ads/${id}`, payload);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${DB_URI}/ads/${id}`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAds,
    createAd,
    updateAd,
    deleteAd,
  };
};

export default useAds;
