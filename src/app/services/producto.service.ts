import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    {
      id: 1,
      codigo: 'A001',
      nombre: 'Laptop Dell Inspiron',
      costo: 800,
      precio: 95,
      valor: 1200
    },
    {
      id: 2,
      codigo: 'B002',
      nombre: 'Mouse Inalámbrico Logitech',
      costo: 15,
      precio: 25,
      valor: 35
    },
    {
      id: 3,
      codigo: 'C003',
      nombre: 'Teclado Mecánico Gaming',
      costo: 45,
      precio: 75,
      valor: 120
    }
  ];

  private siguienteId = 4;

  constructor() { }

  // Listar todos los productos
  listar(): Observable<Producto[]> {
    return of([...this.productos]).pipe(delay(500));
  }

  // Obtener producto por ID
  obtenerPorId(id: number): Observable<Producto | undefined> {
    const producto = this.productos.find(p => p.id === id);
    return of(producto).pipe(delay(300));
  }

  // Agregar nuevo producto
  agregar(producto: Producto): Observable<Producto> {
    // Verificar si el código ya existe
    if (this.productos.some(p => p.codigo === producto.codigo)) {
      return throwError(() => new Error('El código del producto ya existe'));
    }

    const nuevoProducto: Producto = {
      ...producto,
      id: this.siguienteId++
    };
    
    this.productos.push(nuevoProducto);
    return of(nuevoProducto).pipe(delay(700));
  }

  // Actualizar producto existente
  actualizar(producto: Producto): Observable<Producto> {
    const index = this.productos.findIndex(p => p.id === producto.id);
    
    if (index === -1) {
      return throwError(() => new Error('Producto no encontrado'));
    }

    // Verificar si el código ya existe en otro producto
    const codigoExiste = this.productos.some(p => 
      p.codigo === producto.codigo && p.id !== producto.id
    );
    
    if (codigoExiste) {
      return throwError(() => new Error('El código del producto ya existe'));
    }

    this.productos[index] = { ...producto };
    return of(this.productos[index]).pipe(delay(700));
  }

  // Eliminar producto
  eliminar(id: number): Observable<boolean> {
    const index = this.productos.findIndex(p => p.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Producto no encontrado'));
    }

    this.productos.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  // Verificar si el código existe
  codigoExiste(codigo: string, idExcluir?: number): boolean {
    return this.productos.some(p => 
      p.codigo === codigo && (!idExcluir || p.id !== idExcluir)
    );
  }
}