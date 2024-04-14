import { environment } from '../../enviroments/environment';
import { api } from '../axios';

const CategoriesService = () => {
    const getAllCategories = async () => {
        try {
            const response = await api.private.get(`${environment.urls.categories}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const getCurrentCategory = async (id) => {
        try {
            const response = await api.private.get(`${environment.urls.categories}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const createCategory = async (payload) => {
        try {
            const response = await api.private.post(`${environment.urls.categories}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const updateCategory = async (categoryId, payload) => {
        try {
            const response = await api.private.patch(`${environment.urls.categories}/${categoryId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const removeCategory = async (id) => {
        try {
            await api.private.delete(`${environment.urls.categories}/${id}`);
            return 'Successfully deleted';
        } catch (error) {
            throw error;
        }
    };

    return {
        getAllCategories,
        getCurrentCategory,
        createCategory,
        updateCategory,
        removeCategory,
    };
};

export default CategoriesService();
