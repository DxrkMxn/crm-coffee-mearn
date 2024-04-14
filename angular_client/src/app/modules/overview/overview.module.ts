import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverviewComponent } from "./component/overview.component";
import { LoaderModule } from "../../shared/components/loader/loader.module";

@NgModule({
      declarations: [OverviewComponent],
      imports: [CommonModule, LoaderModule],
})
export class OverviewModule {}
