import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "./component/order.component";
import { OrderCategoriesComponent } from "./component/order-categories/order-categories.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { LoaderModule } from "../../shared/components/loader/loader.module";
import { OrderService as AppOrdersService } from "./service/order.service";
import { FormsModule } from "@angular/forms";
import { OrderOptionsComponent } from "./component/order-options/order-options.component";

@NgModule({
      declarations: [
            OrderComponent,
            OrderOptionsComponent,
            OrderCategoriesComponent,
      ],
      imports: [
            CommonModule,
            RouterOutlet,
            RouterLink,
            LoaderModule,
            FormsModule,
      ],
      providers: [AppOrdersService],
})
export class OrderModule {}
