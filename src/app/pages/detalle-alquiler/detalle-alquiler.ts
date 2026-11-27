/*import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-detalle-alquiler',
  styleUrl: './detalle-alquiler.css',
  templateUrl: './detalle-alquiler.html',
})
export class DetalleAlquiler {}
*/
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RentaService } from '../../services/renta';
import { Alquiler } from '../../models/renta';

@Component({
  selector: 'app-detalle-alquiler',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-alquiler.html',
  styleUrl: './detalle-alquiler.css'
})
export class DetalleAlquiler implements OnInit {
  private route = inject(ActivatedRoute);
  private rentaService = inject(RentaService);

  alquiler: Alquiler | undefined;
  cargando: boolean = true;
  mensajeExito: string = '';

  async ngOnInit() {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(idParam) && idParam > 0) {
      this.alquiler = await this.rentaService.obtenerAlquilerPorId(idParam);
    }
    this.cargando = false;
  }

  async devolverEquipo() {
    if (!this.alquiler?.id) return;
    await this.rentaService.procesarDevolucion(this.alquiler.id);
    this.alquiler = await this.rentaService.obtenerAlquilerPorId(this.alquiler.id);
    this.mensajeExito = '¡Devolución registrada con éxito! Las unidades ya están disponibles nuevamente en el catálogo.';
  }
}