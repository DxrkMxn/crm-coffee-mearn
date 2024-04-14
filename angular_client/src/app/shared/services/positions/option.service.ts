import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../enviroments/environment";
import { OptionInterface } from "../../interfaces/option.interface";
import { EmailSchemaInterface } from "../../interfaces/email-schema.interface";

@Injectable({
      providedIn: "root",
})
export class OptionsService {
      constructor(private http: HttpClient) {}

      createOption(body: OptionInterface): Observable<OptionInterface> {
            return this.http.post<OptionInterface>(
                  environment.urls.option,
                  body,
            );
      }

      createMailingOption(body: EmailSchemaInterface): Observable<EmailSchemaInterface> {
            return this.http.post<EmailSchemaInterface>(
                  environment.urls.mail,
                  body,
            );
      }

      getAllOptions(categoryId: string): Observable<OptionInterface[]> {
            return this.http.get<OptionInterface[]>(
                  `${environment.urls.option}/${categoryId}`,
            );
      }

      getAllMailingOptions(schemaId: string): Observable<OptionInterface[]> {
            return this.http.get<OptionInterface[]>(
                  `${environment.urls.mail}/${schemaId}`,
            );
      }

      removeOption(id: string): Observable<OptionInterface> {
            return this.http.delete<OptionInterface>(
                  `${environment.urls.option}/${id}`,
            );
      }

      removeMailingOption(id: string): Observable<EmailSchemaInterface> {
            return this.http.delete<EmailSchemaInterface>(
                  `${environment.urls.option}/${id}`,
            );
      }

      updateOption(
            optionId: string,
            name?: string,
            cost?: number,
      ): Observable<OptionInterface> {
            return this.http.patch<OptionInterface>(
                  `${environment.urls.option}/${optionId}`,
                  { name, cost },
            );
      }

      updateMailingOption(
            schemaId: string,
            name?: string,
            subject?: string,
            sendDate?: Date,
            templateUrl?: string,
      ): Observable<EmailSchemaInterface> {
            return this.http.patch<EmailSchemaInterface>(
                  `${environment.urls.mail}/${schemaId}`,
                  { name, subject,sendDate, templateUrl },
            );
      }
}
