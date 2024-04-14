import { NgModule } from "@angular/core";
import { AnalyticsComponent } from "./component/analytics.component";
import { LoaderModule } from "../../shared/components/loader/loader.module";
import { CommonModule } from "@angular/common";

@NgModule({
      declarations: [AnalyticsComponent],
      imports: [CommonModule, LoaderModule],
})
export class AnalyticsModule {}
