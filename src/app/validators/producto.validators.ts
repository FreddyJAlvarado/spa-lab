import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ProductoValidators {
  
  // Validación para el precio (rango 10-100)
  static precioRango(min: number = 10, max: number = 100): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      
      const valor = parseFloat(control.value);
      if (isNaN(valor) || valor < min || valor > max) {
        return { 
          precioFueraRango: { 
            mensaje: 'El precio está fuera de rango.',
            valorActual: control.value,
            min: min,
            max: max
          }
        };
      }
      return null;
    };
  }

  // Validación para código de producto (letra seguida de números)
  static codigoProducto(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const patron = /^[A-Za-z][0-9]+$/;
      if (!patron.test(control.value)) {
        return { 
          codigoInvalido: { 
            mensaje: 'El código debe iniciar con una letra seguida de números (ej: A001)',
            valorActual: control.value
          }
        };
      }
      return null;
    };
  }

  // Validación para nombre del producto (mínimo 5 caracteres)
  static nombreMinimo(min: number = 5): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim().length === 0) {
        return { 
          nombreRequerido: { 
            mensaje: 'El nombre del producto es requerido.'
          }
        };
      }
      
      if (control.value.trim().length < min) {
        return { 
          nombreMinimo: { 
            mensaje: 'El nombre del producto debe tener mínimo 5 caracteres.',
            longitudActual: control.value.trim().length,
            longitudMinima: min
          }
        };
      }
      return null;
    };
  }

  // Validación para costo (mayor a cero)
  static costoValido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      
      const valor = parseFloat(control.value);
      if (isNaN(valor) || valor <= 0) {
        return { 
          costoInvalido: { 
            mensaje: 'Ingrese un costo válido.',
            valorActual: control.value
          }
        };
      }
      return null;
    };
  }
}