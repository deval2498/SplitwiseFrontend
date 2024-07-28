import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (Component, isProtected) => {
  const WithAuthComponent = (props) => {
    const accessToken = "lTEsKBVKvmo35lmA0fJtQx9X4pzPOpPg4X6VqWNF"

    if (isProtected) {
      if (!accessToken) {
        return <Navigate to="/" />;
      }
    } else {
      if (accessToken) {
        return <Navigate to="/user_info" />;
      }
    }

    return <Component {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
