import { api } from "../axios";
import { environment } from '../../enviroments/environment';

const EmailSchemasService = () => {
  const getEmailSchemas = async ({ page, pageSize }) => {
    const params = { page, pageSize };

    try {
      const response = await api.private.get(`${environment.urls.mail}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getEmailSchemaById = async (id) => {
    try {
      const response = await api.private.get(`${environment.urls.mail}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createEmailSchema = async (schema) => {
    try {
      const response = await api.private.post(`${environment.urls.mail}/`, schema);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateEmailSchema = async (id, schema) => {
    try {
      const response = await api.private.patch(`${environment.urls.mail}/${id}`, schema);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteEmailSchema = async (id) => {
    try {
      await api.private.delete(`${environment.urls.mail}/${id}`);
      return 'Successfully deleted';
    } catch (error) {
      throw error;
    }
  };

  const sendEmailsToAll = async (schemaId) => {
    try {
      const response = await api.post(`${environment.urls.mail}/send`, { schemaId });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getEmailSchemas,
    getEmailSchemaById,
    createEmailSchema,
    updateEmailSchema,
    deleteEmailSchema,
    sendEmailsToAll,
  };
};

export default EmailSchemasService();
