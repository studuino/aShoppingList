import {AbstractControl} from '@angular/forms';

export class PasswordValidator {
  static passwordsMustMatch() {
    return (control: AbstractControl): { [key: string]: any } => {

      const formGroup = control.parent;

      if (formGroup) {
        const pw = formGroup.get('password');

        return pw.value !== control.value ?
            {'passwordsMustMatch': {value: control.value}} :
            null;
      }
      return null;
    };
  }
}