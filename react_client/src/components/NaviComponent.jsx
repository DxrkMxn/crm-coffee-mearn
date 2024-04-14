import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Subject } from 'rxjs';
import MaterialService from '../api/services/MaterialService';
import { RouterPathsEnum } from '../api/enums/routerPaths.enum.tsx';
import AuthService from '../api/services/AuthService';
import { decodeToken } from 'react-jwt';
import OrderService from '../api/services/OrderService.jsx';

const NaviComponent = ({ children }) => {
    const routerPathsEnum = RouterPathsEnum;
    const location = useLocation();
    const navigate = useNavigate();
    const destroy$ = useRef(new Subject());

    const [isAdmin, setIsAdmin] = useState(false);
    const [linksList, setLinksList] = useState([
        { path: RouterPathsEnum.OVERVIEW, title: 'Resumen', display: false },
        { path: RouterPathsEnum.ANALYTICS, title: 'Análisis', display: false },
        { path: RouterPathsEnum.MAILING, title: 'Emails', display: false },
        { path: RouterPathsEnum.HISTORY, title: 'Historial', display: true },
        { path: RouterPathsEnum.ORDER, title: 'Agregar pedido', display: true },
        { path: RouterPathsEnum.CATEGORIES, title: 'Categorías', display: false },
        { path: RouterPathsEnum.PROFILE, title: 'Perfil', display: true },
    ]);
    const floatingRef = useRef(null);
    const materialService = MaterialService;

    useEffect(() => {
        MaterialService.M.FloatingActionButton.init(floatingRef.current);

        const token = localStorage.getItem('authToken');
        if ( token ) {
            const myDecodedToken = decodeToken(token);
            AuthService.getUserDetails({ userId: myDecodedToken.userId })
            .then(user => {
                setIsAdmin(prev => prev = user?.admin);
                updateLinksDisplay(user?.admin);
            })
            return () => {
                destroy$.current.next();
                destroy$.current.complete();
            };
        }

    }, []);

    useEffect(() => {
        if (floatingRef.current) {
            materialService.initializeFloatingButton(floatingRef.current);
        }
    }, [floatingRef]);

    const logout = () => {
        OrderService.clear();
        AuthService.logout();
        navigate(routerPathsEnum.LOGIN);
    };

    const updateLinksDisplay = (isAdmin) => {
        setLinksList((prevLinks) =>
            prevLinks.map((link) => {
                if (
                    link.title === 'Resumen' ||
                    link.title === 'Análisis' ||
                    link.title === 'Categorías' ||
                    link.title === 'Emails'
                ) {
                    return { ...link, display: isAdmin };
                }
                return link;
            })
        );
    };

    return (
        <>
            <ul className="sidenav sidenav-fixed a-sidenav">
                <h4>CRM MERN</h4>
                {linksList.map((item) => (
                    <li
                        key={item.title}
                        className={(location.pathname.includes(item.path) ? "bold active" : "bold")}
                        style={{ display: item.display ? 'block' : 'none' }}
                    >
                        <Link
                            to={'/' + item.path}
                            className={"waves-effect waves-react"}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
                <li className="bold last">
                    <Link
                        to={'/login'}
                        onClick={logout}
                        className="waves-effect waves-react">
                        Cerrar Sesión
                    </Link>
                </li>
            </ul>
            {children}
            <div className="fixed-action-btn" ref={floatingRef}>
                <Link className="btn-floating btn-large" style={{backgroundColor: "#919D9C"}}>
                    <i className="large material-icons">coffee</i>
                </Link>
                <ul>
                    <li>
                        <Link
                            to={"/" + routerPathsEnum.ORDER}
                            className="btn-floating green"
                        >
                            <i className="material-icons">assignment</i>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={"/" + routerPathsEnum.HISTORY}
                            className="btn-floating blue"
                        >
                            <i className="material-icons">list</i>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default NaviComponent;
