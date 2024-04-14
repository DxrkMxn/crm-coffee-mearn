import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { EmailSchemaInterface } from "../../interfaces/email-schema.interface";
import { environment } from "src/enviroments/environment";

@Injectable({
    providedIn: "root",
})
export class EmailSchemasService {
    constructor(private http: HttpClient) { }

    getEmailSchemas(page: number, pageSize: number): Observable<EmailSchemaInterface[]> {
        let params = new HttpParams();
        if (page != null && pageSize != null) {
            params = params.set('page', page.toString()).set('limit', pageSize.toString());
        }
        return this.http.get<EmailSchemaInterface[]>(`${environment.urls.mail}`, { params });
    }

    getEmailSchemaById(id: string): Observable<EmailSchemaInterface> {
        return this.http.get<EmailSchemaInterface>(`${environment.urls.mail}/${id}`);
    }

    createEmailSchema(schema: EmailSchemaInterface): Observable<EmailSchemaInterface> {
        return this.http.post<EmailSchemaInterface>(`${environment.urls.mail}/`, schema);
    }

    updateEmailSchema(id: string, schema: EmailSchemaInterface): Observable<EmailSchemaInterface> {
        return this.http.patch<EmailSchemaInterface>(`${environment.urls.mail}/${id}`, schema);
    }

    deleteEmailSchema(id: string): Observable<any> {
        return this.http.delete<any>(`${environment.urls.mail}/${id}`);
    }

    sendEmailsToAll(schemaId: string): Observable<any> {
        return this.http.post<any>(`${environment.urls.mail}/send`, { schemaId });
    }
}
