import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, OnInit } from "@angular/core";
import { MaterialInterface, MaterialService } from "../../../../../shared/classes/material.service";
import { OrderInterface } from "src/app/shared/interfaces/option.interface";
import { OrderService } from "src/app/modules/order/service/order.service";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "src/app/shared/services/auth/auth.service";

@Component({
      selector: "crm-history-list",
      templateUrl: "./history-list.component.html",
      styleUrls: ["./history-list.component.css"],
})
export class HistoryListComponent implements OnInit, AfterViewInit, OnDestroy {
      modalWindow!: MaterialInterface;
      selectedOrder!: OrderInterface;
      isAdmin: boolean = false;
      @Input("historyList") historyListProps!: OrderInterface[] | null;
      @ViewChild("modal") modalRef!: ElementRef;
      @Output() orderFinished = new EventEmitter<void>();
      @Output() fetch = new EventEmitter<void>();
      private destroy$ = new Subject<void>();
      constructor(
            private materialService: MaterialService,
            private orderService: OrderService,
            private authService: AuthService,
      ) {
            this.isAdmin = this.authService.isAdmin();
      }

      ngOnInit(): void {
            this.authService.currentUser
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((user) => {
                        this.isAdmin = user?.admin === true;
                  });
      }

      selectOrder(item: OrderInterface) {
            this.selectedOrder = item;
            this.modalWindow.open();
      }

      calculateTotalCost(historyItem: OrderInterface): number {
            return historyItem.list.reduce((acc, el) => {
                  return (acc += el.quantity ? el.cost * el.quantity : el.cost);
            }, 0);
      }

      trackById(index: number, item: OrderInterface) {
            return item._id;
      }

      ngAfterViewInit(): void {
            this.modalWindow = this.materialService.initModal(
                  this.modalRef.nativeElement,
            );
      }

      finishOrder() {
            if (this.selectedOrder && this.selectedOrder._id) {
                  this.orderService.finishOrder(this.selectedOrder._id).subscribe({
                        next: (updatedOrder) => {
                              this.selectedOrder = updatedOrder;
                              this.materialService.toast('Orden finalizada!');
                              this.closeModal();
                              this.orderFinished.emit();
                        },
                        error: (err) => {
                              this.materialService.toast('Error al finalizar la orden');
                        }
                  });
            } else {
                  this.materialService.toast('La orden seleccionada no tiene un ID válido.');
            }
      }

      closeModal() {
            this.fetch.emit();
            this.modalWindow.close();
      }

      ngOnDestroy(): void {
            this.modalWindow.destroy();
            this.destroy$.next();
            this.destroy$.complete();
      }
}
