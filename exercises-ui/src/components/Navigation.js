import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="nav-bar">
            <ul>
                <li className="nav-bar-item"><Link to="/">Home Page</Link></li> 
                <li className="nav-bar-item"><Link to="/create-exercise">Create Exercise</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;