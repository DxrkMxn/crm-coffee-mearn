import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const AuthBlock = ({ children }) => {
  const location = useLocation();
    return (
      <>
        <nav>
          <div className="nav-wrapper blue darken-1">
            <Link to="/" className="brand-logo">
              CRM MERN
            </Link>
            <ul id="nav-mobile" className="right">
              {location.pathname.includes("/register") ? (
                <li>
                  <Link to="/login">Iniciar</Link>
                </li>
              ) : (
                <li>
                  <Link to="/register">Registrarse</Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
        <div className="auth-block">{children}</div>
      </>
    );
  };

export default AuthBlock


