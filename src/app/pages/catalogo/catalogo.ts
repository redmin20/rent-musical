import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RentaService } from '../../services/renta';
import { Equipo } from '../../models/renta';
import { TarjetaEquipo } from '../../components/tarjeta-equipo/tarjeta-equipo';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule, FormsModule, TarjetaEquipo],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  private rentaService = inject(RentaService);
  private router = inject(Router);

  equipos: Equipo[] = [];
  textoBusqueda: string = '';
  categoriaSeleccionada: string = 'Todas';

  async ngOnInit() {
    await this.rentaService.inicializarDatos();
    this.equipos = await this.rentaService.obtenerEquipos();
  }

  get equiposFiltrados(): Equipo[] {
    return this.equipos.filter(eq => {
      const coincideTexto = eq.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === 'Todas' || eq.categoria === this.categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }

  irARegistro(equipoId: number) {
    this.router.navigate(['/nuevo-alquiler'], { queryParams: { equipoId } });
  }
}