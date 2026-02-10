import axios from "axios";
import { useEffect, useState } from "react";
import { DB_URI } from "../utils/server-route";

const useMatch = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    try {
      const { data } = await axios.get(`${DB_URI}/matches`);
      setMatches(data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getMatch = async (id) => {
    try {
      const { data } = await axios.get(`${DB_URI}/matches/${id}`);
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const createMatch = async (payload) => {
    try {
      const { data } = await axios.post(`${DB_URI}/matches`, payload);
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const recentMatches = async () => {
    try {
      const { data } = await axios.get(`${DB_URI}/matches`);
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const updateMatch = async (id, payload) => {
    try {
      const { data } = await axios.patch(`${DB_URI}/matches/${id}`, payload);
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const recordBall = async (matchId, ballData, matchState) => {
    try {
      const { data } = await axios.post(`${DB_URI}/matches/record-ball`, {
        matchId,
        ballData,
        matchState,
      });
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    matches,
    loading,
    error,
    createMatch,
    recentMatches,
    getMatch,
    updateMatch,
    recordBall,
  };
};

export default useMatch;
