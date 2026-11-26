import { Routes } from '@angular/router';
import { Catalogo } from './pages/catalogo/catalogo';
import { RegistroAlquiler } from './pages/registro-alquiler/registro-alquiler';
import { Historial } from './pages/historial/historial';
import { DetalleAlquiler } from './pages/detalle-alquiler/detalle-alquiler';

export const routes: Routes = [
  { path: '', redirectTo: 'equipos', pathMatch: 'full' },
  { path: 'equipos', component: Catalogo },
  { path: 'nuevo-alquiler', component: RegistroAlquiler },
  { path: 'alquileres', component: Historial },
  { path: 'alquileres/:id', component: DetalleAlquiler },
  { path: '**', redirectTo: 'equipos' }
];