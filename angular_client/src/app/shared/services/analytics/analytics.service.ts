import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../enviroments/environment";
import {
      AnalyticsInterface,
      OverviewInterface,
} from "../../interfaces/analyticsInterface";
import { Observable } from "rxjs";

@Injectable({
      providedIn: "root",
})
export class AnalyticsService {
      constructor(private http: HttpClient) {}

      getOverview(): Observable<OverviewInterface> {
            return this.http.get<OverviewInterface>(
                  `${environment.urls.analytics}/overview`,
            );
      }

      getAnalytics(): Observable<AnalyticsInterface> {
            return this.http.get<AnalyticsInterface>(
                  `${environment.urls.analytics}/analytics`,
            );
      }
}
