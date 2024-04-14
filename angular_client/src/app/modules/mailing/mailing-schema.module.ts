import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { LoaderModule } from "../../shared/components/loader/loader.module";
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from "@angular/forms";
import { MailingSchemasComponent } from "./components/mailing-schema.component";
import { OptionsFormComponent } from "./components/mailing-schema-form/mailing-schema-form/options-form.component";
import { ConfirmMailDialogComponent } from "./components/mailing-schema-form/confirm-dialog/confirm-dialog.component";
import { MailingSchemaFormComponent } from "./components/mailing-schema-form/mailing-schema-form";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
      declarations: [MailingSchemasComponent, MailingSchemaFormComponent, OptionsFormComponent, ConfirmMailDialogComponent],
      imports: [
            CommonModule,
            RouterLink,
            LoaderModule,
            ReactiveFormsModule,
            MatDialogModule,
            MatDatepickerModule,
            MatFormFieldModule,
            MatInputModule,
      ],
})
export class MailingModule { }