import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-category-dialog',
  template: `
    <h1 mat-dialog-title>Confirma</h1>
    <div mat-dialog-content>
      <p>¿Confirmas que vas a eliminar esta categoría?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Sí</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </div>
  `,
})
export class ConfirmCategoryDialogComponent { }