/*import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-historial',
  styleUrl: './historial.css',
  templateUrl: './historial.html',
})
export class Historial {}
*/

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RentaService } from '../../services/renta';
import { Alquiler } from '../../models/renta';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {
  private rentaService = inject(RentaService);

  alquileres: Alquiler[] = [];
  filtroEstado: string = 'Todos';

  async ngOnInit() {
    const lista = await this.rentaService.obtenerAlquileres();
    this.alquileres = lista.reverse();
  }

  get alquileresFiltrados(): Alquiler[] {
    if (this.filtroEstado === 'Todos') return this.alquileres;
    return this.alquileres.filter(a => a.estado === this.filtroEstado);
  }
}