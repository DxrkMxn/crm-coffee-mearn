import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header.component";
import { RouterModule } from "@angular/router";

@NgModule({
      declarations: [HeaderComponent],
      imports: [CommonModule, RouterModule],
})
export class HeaderModule {}
