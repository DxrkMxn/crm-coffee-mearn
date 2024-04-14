import {
      AfterViewInit,
      Component,
      ElementRef,
      OnDestroy,
      ViewChild,
} from "@angular/core";
import { AnalyticsService } from "../../../shared/services/analytics/analytics.service";
import { AnalyticsInterface } from "../../../shared/interfaces/analyticsInterface";
import { Subject, takeUntil } from "rxjs";
import {
      Chart,
      ChartConfiguration,
      ChartTypeRegistry,
      registerables,
} from "chart.js";

@Component({
      selector: "crm-analytics",
      templateUrl: "./analytics.component.html",
      styleUrls: ["./analytics.component.css"],
})
export class AnalyticsComponent implements AfterViewInit, OnDestroy {
      analytics: AnalyticsInterface | undefined;
      average: number | undefined;
      pending = true;
      isAlive = new Subject<void>();
      @ViewChild("gain") gainRef: ElementRef | undefined;
      @ViewChild("order") orderRef: ElementRef | undefined;
      @ViewChild('avgGain') avgGainRef: ElementRef | undefined;
      @ViewChild('avgOrder') avgOrderRef: ElementRef | undefined;

      constructor(private analyticsService: AnalyticsService) {
            Chart.register(...registerables);
      }

      ngAfterViewInit(): void {
            this.analyticsService.getAnalytics()
                  .pipe(takeUntil(this.isAlive))
                  .subscribe(data => {
                        this.average = data.average;

                        const labels = data.chart.map(item => item.label);
                        const gains = data.chart.map(item => item.gain);
                        const orders = data.chart.map(item => item.order);

                        const gainDataset = {
                              label: "Ingresos",
                              data: gains,
                              borderColor: "rgb(255,99,132)",
                              fill: false,
                              tension: 0.1,
                        };

                        const orderDataset = {
                              label: "Pedidos",
                              data: orders,
                              borderColor: "#ef5350",
                              fill: false,
                              tension: 0.1,
                        };

                        const incomeSlope = (gains[gains.length - 1] - gains[0]) / (gains.length - 1);
                        const incomeSlopeDataset = {
                              label: "Pendiente de Ingresos",
                              data: gains.map((_, index) => gains[0] + incomeSlope * index),
                              borderColor: "#2691FF",
                              fill: false,
                              tension: 0.1,
                              borderDash: [5, 5]
                        };

                        const orderSlope = (orders[orders.length - 1] - orders[0]) / (orders.length - 1);
                        const orderSlopeDataset = {
                              label: "Pendiente de Pedidos",
                              data: orders.map((_, index) => orders[0] + orderSlope * index),
                              borderColor: "#FF9126",
                              fill: false,
                              tension: 0.1,
                              borderDash: [5, 5]
                        };

                        const gainContext = this.gainRef?.nativeElement.getContext('2d');
                        const orderContext = this.orderRef?.nativeElement.getContext('2d');
                        const avgGainContext = this.avgGainRef?.nativeElement.getContext('2d');
                        const avgOrderContext = this.avgOrderRef?.nativeElement.getContext('2d');

                        if (gainContext && orderContext && avgGainContext && avgOrderContext) {
                              gainContext.canvas.height = "300px";
                              orderContext.canvas.height = "300px";
                              avgGainContext.canvas.height = "300px";
                              avgOrderContext.canvas.height = "300px";

                              new Chart(gainContext, generateChartConfig(labels, [gainDataset]));
                              new Chart(orderContext, generateChartConfig(labels, [orderDataset]));
                              new Chart(avgGainContext, generateChartConfig(labels, [gainDataset, incomeSlopeDataset]));
                              new Chart(avgOrderContext, generateChartConfig(labels, [orderDataset, orderSlopeDataset]));
                        }

                        this.pending = false;
                  });
      }

      ngOnDestroy(): void {
            this.isAlive.next();
            this.isAlive.complete();
      }
}

function generateChartConfig(labels: string[], datasets: any[]) {
      return {
            type: "line",
            data: {
                  labels,
                  datasets,
            },
      } as ChartConfiguration<keyof ChartTypeRegistry, any, unknown>;
}
