import axios from "axios";
import { useState } from "react";
import { DB_URI } from "../utils/server-route";

const useArticles = () => {
  const [loading, setLoading] = useState(false);

  const getArticles = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${DB_URI}/articles`, { params });
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getArticle = async (slug) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${DB_URI}/articles/${slug}`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (payload) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${DB_URI}/articles`, payload);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(`${DB_URI}/articles/${id}`, payload);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${DB_URI}/articles/${id}`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

export default useArticles;
