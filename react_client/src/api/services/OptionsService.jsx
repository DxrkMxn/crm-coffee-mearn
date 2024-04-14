import { environment } from "../../enviroments/environment";
import { api } from "../axios";

const OptionsService = {
    createOption: async (body) => {
        try {
            const response = await api.private.post(`${environment.urls.option}`, body);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createMailingOption: async (body) => {
        try {
            const response = await api.private.post(`${environment.urls.mail}`, body);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getAllCategories: async () => {
        try {
            const response = await api.private.get(`${environment.urls.categories}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getAllOptions: async (id) => {
        try {
            const response = await api.private.get(`${environment.urls.option}/`+id);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getAllMailingOptions: async (schemaId) => {
        try {
            const response = await api.private.get(`${environment.urls.mail}/${schemaId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    removeOption: async (id) => {
        try {
            const response = await api.private.delete(`${environment.urls.option}/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    removeMailingOption: async (id) => {
        try {
            const response = await api.private.delete(`${environment.urls.option}/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateOption: async ({name, cost, _id}) => {
        try {
            const response = await api.private.patch(`${environment.urls.option}/${_id}`, { name, cost, _id });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateMailingOption: async (schemaId, name, subject, sendDate, templateUrl) => {
        try {
            const response = await api.private.patch(`${environment.urls.mail}/${schemaId}`, { name, subject, sendDate, templateUrl });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

export default OptionsService;
