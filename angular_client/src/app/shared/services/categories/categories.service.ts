import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../enviroments/environment";
import { CategoryInterface } from "../../interfaces/category.interface";
import { Observable, from, switchMap } from "rxjs";
import { MessageInterface } from "../../interfaces/message.interface";

@Injectable({
      providedIn: 'root'
})
export class CategoriesService {

      constructor(private http: HttpClient) { }

      getAllCategories(): Observable<CategoryInterface[]> {
            return this.http.get<CategoryInterface[]>(environment.urls.categories);
      }

      getCurrentCategory(id: string): Observable<CategoryInterface> {
            return this.http.get<CategoryInterface>(`${environment.urls.categories}/${id}`);
      }

      createCategory(payload: { name: string; image: string }): Observable<CategoryInterface> {
            return this.http.post<CategoryInterface>(`${environment.urls.categories}`, payload);
      }

      updateCategory(categoryId: string, payload: { name: string; image: string }): Observable<CategoryInterface> {
            return this.http.patch<CategoryInterface>(`${environment.urls.categories}/${categoryId}`, payload);
      }

      removeCategory(id: string): Observable<MessageInterface> {
            return this.http.delete<MessageInterface>(`${environment.urls.categories}/${id}`);
      }
}
