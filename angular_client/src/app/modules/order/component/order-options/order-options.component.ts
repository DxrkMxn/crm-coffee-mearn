import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { map, Observable, switchMap } from "rxjs";
import { OrderService as AppOrdersService } from "../../service/order.service";
import { MaterialService } from "../../../../shared/classes/material.service";
import { OptionWithQuantityInterface } from "src/app/shared/interfaces/option.interface";
import { OptionsService } from "src/app/shared/services/positions/option.service";

@Component({
      selector: "app-order-options",
      templateUrl: "./order-options.component.html",
      styleUrls: ["./order-options.component.css"],
})
export class OrderOptionsComponent implements OnInit {
      options$!: Observable<OptionWithQuantityInterface[]>;
      constructor(
            private optionsService: OptionsService,
            private route: ActivatedRoute,
            private appOrderService: AppOrdersService,
            private materialService: MaterialService,
      ) {}

      ngOnInit(): void {
            this.options$ = this.route.params.pipe(
                  switchMap((params: Params) => {
                        return this.optionsService.getAllOptions(
                              params["id"],
                        );
                  }),
                  map(options => options.map(p => ({ ...p, quantity: 1 }))),
            );
      }

      addToOrder(option: OptionWithQuantityInterface) {
            this.materialService.toast(
                  `La Opción ${option.name} x${option.quantity} fue agregada.`,
            );
            this.appOrderService.add(option);
      }
}
