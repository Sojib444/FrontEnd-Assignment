
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noOnlySpacesValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  return value ? null : { onlySpaces: true };
}