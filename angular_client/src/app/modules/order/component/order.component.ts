import {
      AfterViewInit,
      Component,
      ElementRef,
      OnDestroy,
      OnInit,
      ViewChild,
} from "@angular/core";
import { RouterPathsEnum } from "../../../shared/enums/routerPaths.enum";
import { Router } from "@angular/router";
import { EMPTY, Subject, catchError, of, switchMap, takeUntil } from "rxjs";
import {
      MaterialInterface,
      MaterialService,
} from "../../../shared/classes/material.service";
import { OrderService as AppOrdersService } from "../service/order.service";
import { OrdersService as HttpOrdersService } from "../../../shared/services/orders/orders.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { OrderInterface, OptionWithQuantityInterface } from "src/app/shared/interfaces/option.interface";

@Component({
      selector: "crm-order",
      templateUrl: "./order.component.html",
      styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit, OnDestroy, AfterViewInit {
      routesPaths = RouterPathsEnum;
      isRoot: boolean | undefined;
      pending = false;
      isAlive = new Subject<void>();
      listToOrder: OptionWithQuantityInterface[] | undefined;
      @ViewChild("modal") modalRef!: ElementRef;
      private modal!: MaterialInterface;
      constructor(
            private router: Router,
            private materialService: MaterialService,
            private appOrdersService: AppOrdersService,
            private httpOrdersService: HttpOrdersService,
            private authService: AuthService,
      ) { }

      ngOnDestroy(): void {
            this.isAlive.next();
            this.isAlive.complete();
      }

      ngOnInit(): void {
            this.router.events
                  .pipe(takeUntil(this.isAlive))
                  .subscribe(event => {
                        this.isRoot =
                                    this.router.url ===
                                          `/${this.routesPaths.ORDER}`;
                  });
            this.listToOrder = this.appOrdersService.list;
      }

      ngAfterViewInit(): void {
            this.modal = this.materialService.initModal(
                  this.modalRef.nativeElement,
            );
      }

      showModal() {
            this.modal.open();
      }

      closeModal() {
            this.modal.close();
      }

      submit() {
            this.pending = true;
            this.authService.currentUser.pipe(
                  takeUntil(this.isAlive),
                  switchMap((currentUser) => {
                        if (!currentUser || !currentUser._id) {
                              this.materialService.toast('No ha iniciado sesión!');
                              this.pending = false;
                              return EMPTY;
                        }
                        return of(currentUser);

                  }),
                  catchError((error) => {
                        this.materialService.toast('No se pueden obtener los detalles del usuario.');
                        this.pending = false;
                        return EMPTY;
                  })
            ).subscribe((userDetails) => {
                  const newOrder: OrderInterface = {
                        client: {
                              name: userDetails.name,
                              surname: userDetails.surname,
                              phone: userDetails.phone,
                              email: userDetails.email,
                        },
                        list: this.appOrdersService.list.map(item => {
                              const { _id, ...itemWithoutId } = item;
                              return itemWithoutId;
                        }),
                        status: 'Pending'
                  };

                  this.httpOrdersService.createOrder(newOrder).subscribe(
                        createdOrder => {
                              let orderNumber = createdOrder.order?.order;
                              this.materialService.toast(`La orden № ${orderNumber} fue creada!`);
                              this.appOrdersService.clear();
                              this.listToOrder = this.appOrdersService.list;
                              this.modal.close();
                              this.pending = false;
                        },
                        err => {
                              this.materialService.toast(err.error.message);
                              this.pending = false;
                        }
                  );
            });
      }



      allPrice(): number {
            return this.appOrdersService.price;
      }

      removePosFromOrder(_id: string) {
            this.appOrdersService.remove(_id);
      }

      trackById(index: number, item: OptionWithQuantityInterface) {
            return item._id;
      }
}
