import { environment } from '../../enviroments/environment.js';
import { api } from '../axios';

const AnalyticsService = () => {
  const getOverview = async () => {
    try {
      const response = await api.private.get(`${environment.urls.analytics}/overview`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  const getAnalytics = async () => {
    try {
      const response = await api.private.get(`${environment.urls.analytics}/analytics`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { getOverview, getAnalytics };
};

export default AnalyticsService();
