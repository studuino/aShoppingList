import { AbstractControl } from '@angular/forms';

export function RepeatPasswordValidator(control: AbstractControl) {
  const password: string = control.get('password').value; // get password from our password form control
  const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
  // compare is the password math
  const passwordsMatch = password === confirmPassword;
  if (!passwordsMatch) {
    control.get('confirmPassword').setErrors({NoPassswordMatch: true});
  }
  return passwordsMatch;
}
