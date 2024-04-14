import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./component/profile.component";
import { AuthFormModule } from "../../shared/components/auth-form/auth-form.module";

@NgModule({
      declarations: [ProfileComponent],
      imports: [CommonModule, AuthFormModule],
})
export class ProfileModule {}
