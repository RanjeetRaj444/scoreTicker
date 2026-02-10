import axios from "axios";
import { useState } from "react";
import { DB_URI } from "../utils/server-route";

const useArticles = () => {
  const [loading, setLoading] = useState(false);

  const getPublishedArticles = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${DB_URI}/articles`, {
        params: { ...params, status: "Published" },
      });
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getArticleBySlug = async (slug) => {
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

  return {
    loading,
    getPublishedArticles,
    getArticleBySlug,
  };
};

export default useArticles;
