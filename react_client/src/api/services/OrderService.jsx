import { environment } from "../../enviroments/environment";
import { api } from "../axios";

const OrderService = {
  listOfOptions: [],
  calculatedPrice: 0,

  get price() {
    return this.calculatedPrice;
  },

  get list() {
    return this.listOfOptions;
  },

  set list(p) {
    this.listOfOptions = p;
  },

  set price(p) {
    this.calculatedPrice = p;
  },

  add(option) {
    const orderOption = {
      name: option.name,
      cost: option.cost,
      quantity: option.quantity,
      _id: option._id,
    };
    const existingOption = this.list.find((p) => p._id === orderOption._id);
    if (existingOption) {
      existingOption.quantity += orderOption.quantity;
    } else {
      this.list.push(orderOption);
    }

    this.calculatePrice();
  },

  remove(id) {
    const idx = this.list.findIndex((p) => p._id === id);
    this.list.splice(idx, 1);
    this.calculatePrice();
  },

  clear() {
    this.list = [];
    this.price = 0;
  },

  createOrder: async (newOrder) => {
    try {
      const response = await api.private.post(`${environment.urls.order}`, newOrder);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getAllOrders: async ({ offset, limit }) => {
    try {
      const response = await api.private.get(`${environment.urls.order}?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getOrdersByUser: async ({ userId, offset, limit }) => {
    try {
      const response = await api.private.get(`${environment.urls.order}/user/${userId}?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  
  finishOrder: async (orderId) => {
    await api.private.patch(`${environment.urls.order}/${orderId}`, { status: 'Finished' })
      .then(response => response);
  },

  calculatePrice() {
    this.calculatedPrice = this.list?.reduce((acc, el) => {
      return acc + el.cost * el.quantity;
    }, 0);
  },
};

export default OrderService;
