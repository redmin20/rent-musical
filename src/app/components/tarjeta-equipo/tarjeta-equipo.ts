/*import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-tarjeta-equipo',
  styleUrl: './tarjeta-equipo.css',
  templateUrl: './tarjeta-equipo.html',
})
export class TarjetaEquipo {}
*/
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipo } from '../../models/renta';

@Component({
  selector: 'app-tarjeta-equipo',
  imports: [CommonModule],
  templateUrl: './tarjeta-equipo.html',
  styleUrl: './tarjeta-equipo.css'
})
export class TarjetaEquipo {
  equipo = input.required<Equipo>();
  seleccionarEquipo = output<number>();

  onAlquilar() {
    this.seleccionarEquipo.emit(this.equipo().id);
  }
}