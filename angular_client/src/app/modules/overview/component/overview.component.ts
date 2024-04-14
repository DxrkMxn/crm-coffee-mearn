import {
      AfterViewInit,
      Component,
      ElementRef,
      OnDestroy,
      OnInit,
      ViewChild,
} from "@angular/core";
import { AnalyticsService } from "../../../shared/services/analytics/analytics.service";
import { OverviewInterface } from "../../../shared/interfaces/analyticsInterface";
import { Observable } from "rxjs";
import {
      MaterialInterface,
      MaterialService,
} from "../../../shared/classes/material.service";

@Component({
      selector: "crm-overview",
      templateUrl: "./overview.component.html",
      styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit, OnDestroy, AfterViewInit {
      overview$: Observable<OverviewInterface> | undefined;
      tapTarget: MaterialInterface | undefined;
      yesterday = new Date();
      @ViewChild("tapTarget") tapTargetRef: ElementRef | undefined;
      constructor(
            private analyticsService: AnalyticsService,
            private materialService: MaterialService,
      ) {
            this.yesterday = new Date();
            this.yesterday.setDate(this.yesterday.getDate());
      }

      ngOnInit(): void {
            this.overview$ = this.analyticsService.getOverview();

            this.yesterday.setDate(this.yesterday.getDate() - 1);
      }

      ngOnDestroy(): void { }

      ngAfterViewInit(): void {
            this.tapTarget = this.materialService.initTapTarget(
                  this.tapTargetRef?.nativeElement,
            );
      }

      openTabTarget() {
            this.tapTarget?.open();
      }
}
