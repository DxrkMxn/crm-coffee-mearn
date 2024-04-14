import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./component/register.component";
import { AuthFormModule } from "../../shared/components/auth-form/auth-form.module";

@NgModule({
      declarations: [RegisterComponent],
      imports: [CommonModule, AuthFormModule],
})
export class RegisterModule {}
