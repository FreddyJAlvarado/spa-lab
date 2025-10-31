import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { Producto } from '../models/producto.model';
import { ProductoService } from '../services/producto.service';
import { ProductoValidators } from '../validators/producto.validators';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  editando = false;
  cargando = false;
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.crearFormulario();
  }

  ngOnInit() {
    this.cargarProductos();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      id: [0],
      codigo: ['', [
        Validators.required,
        ProductoValidators.codigoProducto()
      ]],
      nombre: ['', [
        Validators.required,
        ProductoValidators.nombreMinimo(5)
      ]],
      costo: ['', [
        Validators.required,
        ProductoValidators.costoValido()
      ]],
      precio: ['', [
        Validators.required,
        ProductoValidators.precioRango(10, 100)
      ]],
      valor: ['', [
        Validators.required,
        Validators.min(0)
      ]]
    });
  }

  cargarProductos() {
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar productos');
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (this.productoForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.enviando = true;
    const producto = this.productoForm.value;

    if (this.editando) {
      this.productoService.actualizar(producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.cancelar();
          this.enviando = false;
          this.mostrarExito('Producto actualizado exitosamente');
        },
        error: (err) => {
          this.mostrarError(err.message);
          this.enviando = false;
        }
      });
    } else {
      this.productoService.agregar(producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
          this.enviando = false;
          this.mostrarExito('Producto agregado exitosamente');
        },
        error: (err) => {
          this.mostrarError(err.message);
          this.enviando = false;
        }
      });
    }
  }

  editar(producto: Producto) {
    this.editando = true;
    this.productoForm.patchValue(producto);
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.cargarProductos();
        this.mostrarExito('Producto eliminado exitosamente');
      },
      error: (err) => {
        this.mostrarError(err.message);
      }
    });
  }

  cancelar() {
    this.editando = false;
    this.limpiarFormulario();
  }

  private limpiarFormulario() {
    this.productoForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      costo: '',
      precio: '',
      valor: ''
    });
  }

  private marcarCamposComoTocados() {
    Object.keys(this.productoForm.controls).forEach(key => {
      this.productoForm.get(key)?.markAsTouched();
    });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  // Métodos para obtener errores de validación
  obtenerErrorCodigo(): string {
    const control = this.productoForm.get('codigo');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El código es requerido';
      if (control.errors['codigoInvalido']) return control.errors['codigoInvalido'].mensaje;
    }
    return '';
  }

  obtenerErrorNombre(): string {
    const control = this.productoForm.get('nombre');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El nombre es requerido';
      if (control.errors['nombreRequerido']) return control.errors['nombreRequerido'].mensaje;
      if (control.errors['nombreMinimo']) return control.errors['nombreMinimo'].mensaje;
    }
    return '';
  }

  obtenerErrorCosto(): string {
    const control = this.productoForm.get('costo');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El costo es requerido';
      if (control.errors['costoInvalido']) return control.errors['costoInvalido'].mensaje;
    }
    return '';
  }

  obtenerErrorPrecio(): string {
    const control = this.productoForm.get('precio');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El precio es requerido';
      if (control.errors['precioFueraRango']) return control.errors['precioFueraRango'].mensaje;
    }
    return '';
  }

  obtenerErrorValor(): string {
    const control = this.productoForm.get('valor');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El valor es requerido';
      if (control.errors['min']) return 'El valor debe ser mayor o igual a 0';
    }
    return '';
  }

  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }
}