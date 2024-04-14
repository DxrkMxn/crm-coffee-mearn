import { Component, OnInit } from "@angular/core";
import { RouterPathsEnum } from "../../../shared/enums/routerPaths.enum";
import { delay, Observable } from "rxjs";
import { EmailSchemasService } from "src/app/shared/services/email/email.service";
import { EmailSchemaInterface } from "src/app/shared/interfaces/email-schema.interface";

@Component({
      selector: "crm-mailing-schema",
      templateUrl: "./mailing-schema.component.html",
      styleUrls: ["./mailing-schema.component.css"],
})
export class MailingSchemasComponent implements OnInit {
      emailSchemasList$!: Observable<EmailSchemaInterface[]>;
      routerPathsEnum = RouterPathsEnum;
      

      constructor(private emailSchemasService: EmailSchemasService) {}

      trackById(index: number, item: EmailSchemaInterface) {
            return item._id;
      }

      ngOnInit(): void {
            this.emailSchemasList$ = this.emailSchemasService
                  .getEmailSchemas(0,2)
                  .pipe(delay(800));
      }
}
