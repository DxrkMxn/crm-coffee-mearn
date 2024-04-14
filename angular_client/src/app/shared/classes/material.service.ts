import { ElementRef, Injectable } from "@angular/core";
declare var M: any;

export interface MaterialInterface {
      open(): void;
      close(): void;
      destroy(): void;
}
export interface MaterialDatepickerInterface extends MaterialInterface {
      date?: Date;
}
@Injectable({
      providedIn: "root",
})
export class MaterialService {
      constructor() {}

      toast(message: string) {
            M.toast({ html: message });
      }

      initializeFloatingButton(elemRef: ElementRef) {
            M.FloatingActionButton.init(elemRef.nativeElement);
      }

      updateTextInput() {
            M.updateTextFields();
      }

      initModal(elem: ElementRef): MaterialInterface {
            return M.Modal.init(elem);
      }

      initTooltip(elem: ElementRef): MaterialInterface {
            return M.Tooltip.init(elem);
      }

      initDatePicker(
            elem: ElementRef,
            onClose: () => void,
      ): MaterialDatepickerInterface {
            return M.Datepicker.init(elem, {
                  format: "dd.mm.yyyy",
                  showClearBtn: true,
                  onClose,
            });
      }
      initTapTarget(elem: ElementRef): MaterialInterface {
            return M.TapTarget.init(elem);
      }
}
