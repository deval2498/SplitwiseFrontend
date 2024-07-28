import React, { useState, useEffect } from "react";
import api from '../api';
import { useLocation } from "react-router-dom";
import "./UserInfo.css";
import config from "../config";
import { useNavigate } from 'react-router-dom';

const SetToken = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const accessToken = urlParams.get('access_token');
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      try {
        const response = await api.get(config.userApiUrl);
        setUser(response.data.result);
        navigate('/user_info');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [location.search]);


  if (!user) {
    return <p>Loading...</p>;
  }
};

export default SetToken;
