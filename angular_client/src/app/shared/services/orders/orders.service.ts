import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../enviroments/environment";
import { OrderInterface } from "../../interfaces/option.interface";

@Injectable({
      providedIn: "root",
})
export class OrdersService {
      constructor(private http: HttpClient) { }

      createOrder(newOrder: OrderInterface): Observable<OrderInterface> {
            return this.http.post<OrderInterface>(
                  environment.urls.order,
                  newOrder,
            );
      }

      getAllOrders(params: { offset: number; limit: number }): Observable<OrderInterface[]> {
            let queryParams = new HttpParams({ fromObject: params });
            return this.http.get<OrderInterface[]>(environment.urls.order, { params: queryParams });
      }

      getOrdersByUser(userId: string, params: { offset: number; limit: number }): Observable<OrderInterface[]> {
            let queryParams = new HttpParams({ fromObject: params });
            return this.http.get<OrderInterface[]>(`${environment.urls.order}/user/${userId}`, { params: queryParams });
      }
}

