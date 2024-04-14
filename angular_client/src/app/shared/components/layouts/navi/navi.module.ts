import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NaviComponent } from "./component/navi.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@NgModule({
      declarations: [NaviComponent],
      imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class NaviModule {}
