import React from 'react';
import './LogoutConfirmationModal.css';

const LogoutConfirmationModal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <button onClick={onConfirm}>Yes, Logout</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
