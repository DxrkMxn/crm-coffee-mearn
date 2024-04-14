import api from './useAxiosPrivate';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await api.private.get('/refresh');
            setAuth(prev => ({
                ...prev,
                accessToken: response.data.accessToken
            }));
            return response.data.accessToken;
        } catch (error) {
            console.error("Error recargando el Token:", error);
            throw error;
        }
    };

    return refresh;
};

export default useRefreshToken;
