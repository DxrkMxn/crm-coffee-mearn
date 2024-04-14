import {
      AfterViewInit,
      Component,
      ElementRef,
      OnDestroy,
      OnInit,
      ViewChild,
} from "@angular/core";
import { OrdersService as HttpOrdersService, OrdersService } from "../../../shared/services/orders/orders.service";
import { Subject, takeUntil } from "rxjs";
import { environment } from "../../../../enviroments/environment";
import { OrderInterface } from "src/app/shared/interfaces/option.interface";
import { AuthService } from "../../../shared/services/auth/auth.service";

@Component({
      selector: "crm-history",
      templateUrl: "./history.component.html",
      styleUrls: ["./history.component.css"],
})
export class HistoryComponent implements AfterViewInit, OnInit, OnDestroy {
      showFilter = false;
      offset = 0;
      limit = environment.STEP;
      historyList: OrderInterface[] = [];
      isAlive = new Subject<void>();
      @ViewChild("tooltip") tooltipRef: ElementRef | undefined;
      loadingFlag = false;
      reloadingFlag = false;
      noMoreFlag = false;
      constructor(
            private ordersService: OrdersService,
            private authService: AuthService,
      ) { }

      reloadContent() {
            this.historyList = [];
            this.offset = 0;
            this.reloadingFlag = true;
            this.fetch();
      }

      onOrderFinished() {
            this.reloadContent();
      }

      loadMore() {
            this.loadingFlag = true;
            this.limit += environment.STEP;
            this.fetch();
      }

      ngAfterViewInit(): void {
      }

      ngOnDestroy(): void {
            this.isAlive.next();
            this.isAlive.complete();
      }

      ngOnInit(): void {
            this.reloadingFlag = true;
            this.fetch();
      }

      fetch(): void {
            const params: { offset: number; limit: number } = {
                  offset: this.offset,
                  limit: this.limit,
            };

            if (this.authService.isAdmin()) {
                  this.ordersService.getAllOrders(params)
                        .pipe(takeUntil(this.isAlive))
                        .subscribe(
                              (orders: OrderInterface[]) => {
                                    this.historyList = orders;
                                    this.loadingFlag = false;
                                    this.reloadingFlag = false;
                                    this.noMoreFlag = orders.length < this.limit;
                              },
                              (error: Error) => {
                                    console.error('Error obteniendo las Órdenes:', error);
                              }
                        );
            } else {
                  const currentUserId = localStorage.getItem('userDetails');
                  if (currentUserId && currentUserId !== null) {
                        const userData = JSON.parse(currentUserId);
                        this.ordersService.getOrdersByUser(userData._id, params)
                              .pipe(takeUntil(this.isAlive))
                              .subscribe(
                                    (orders: OrderInterface[]) => {
                                          this.historyList = orders;
                                          this.loadingFlag = false;
                                          this.reloadingFlag = false;
                                          this.noMoreFlag = orders.length < this.limit;
                                    },
                                    (error: Error) => {
                                          console.error('Error obteniendo las Órdenes:', error);
                                    }
                              );
                  } else {
                        console.error('Error obteniendo las Órdenes: ID del usuario es undefined.');
                  }
            }
      }

}
