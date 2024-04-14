import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { OrderInterface, OptionWithQuantityInterface } from 'src/app/shared/interfaces/option.interface';

@Injectable({
      providedIn: 'root'
})
export class OrderService {
      private baseUrl = 'https://crm-backend-atjh.onrender.com/api/v1'; 
      private listOfOptions: OptionWithQuantityInterface[] = [];
      private calculatedPrice: number = 0;

      constructor(private http: HttpClient) { }

      get price() {
            return this.calculatedPrice;
      }

      get list() {
            return this.listOfOptions;
      }

      set list(p: any[]) {
            this.listOfOptions = p;
      }

      set price(p: number) {
            this.calculatedPrice = p;
      }

      add(option: OptionWithQuantityInterface) {
            const orderOption = Object.assign(
                  {},
                  {
                        name: option.name,
                        cost: option.cost,
                        quantity: option.quantity,
                        _id: option._id,
                  },
            );
            const existingOption = this.list.find(
                  p => p._id === orderOption._id,
            );
            if (existingOption) {
                  (existingOption.quantity as number) +=
                        orderOption.quantity as number;
            } else {
                  this.list.push(
                        orderOption as OptionWithQuantityInterface,
                  );
            }

            this.calculatePrice();
      }

      remove(id: string) {
            const idx = this.list.findIndex(p => p._id === id);
            this.list.splice(idx, 1);
            this.calculatePrice();
      }

      clear() {
            this.list = [];
            this.price = 0;
      }

      private calculatePrice() {
            this.calculatedPrice = this.list?.reduce((acc, el) => {
                  return acc + el.cost * (el.quantity as number);
            }, 0);
      }
      createOrder(orderData: OrderInterface): Observable<OrderInterface> {
            return this.http.post<OrderInterface>(`${this.baseUrl}/order`, orderData);
      }
      getAllOrders(params: { offset: number; limit: number }): Observable<OrderInterface[]> {
            return this.http.get<OrderInterface[]>(`${this.baseUrl}/order`);
      }
      getOrderById(id: string): Observable<OrderInterface> {
            return this.http.get<OrderInterface>(`${this.baseUrl}/order/${id}`);
      }
      updateOrder(id: string, orderData: OrderInterface): Observable<OrderInterface> {
            return this.http.put<OrderInterface>(`${this.baseUrl}/order/${id}`, orderData);
      }
      finishOrder(orderId: string): Observable<any> {
            return this.http.patch(`${this.baseUrl}/order/${orderId}`, { status: 'Finished' });
      }
      deleteOrder(id: string): Observable<any> {
            return this.http.delete(`${this.baseUrl}/order/${id}`);
      }
}
