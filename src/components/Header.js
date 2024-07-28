import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Make sure the path matches where your CSS file is located

const Header = () => {
    return (
        <header className="global-header">
            <Link to="/" className="header-home-link">Home</Link>
        </header>
    );
};

export default Header;
