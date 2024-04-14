import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    const location = useLocation();
    const logged =localStorage.getItem('authToken')
    if (Boolean(logged)) {
        return <Outlet />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
}

export default RequireAuth;

