import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="nav-bar">
            <ul>
                <li className="nav-bar-item"><Link to="/" className="nav-bar-link">Home Page</Link></li> 
                <li className="nav-bar-item"><Link to="/create-exercise" className="nav-bar-link">Create Exercise</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;