import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <div className="theme-toggle-container" title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
            <label className="theme-switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="slider round">
                    <FaSun className="sun-icon" />
                    <FaMoon className="moon-icon" />
                </span>
            </label>
        </div>
    );
};

export default ThemeToggle;