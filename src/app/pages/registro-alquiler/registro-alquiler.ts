/*import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-registro-alquiler',
  styleUrl: './registro-alquiler.css',
  templateUrl: './registro-alquiler.html',
})
export class RegistroAlquiler {}
*/
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RentaService } from '../../services/renta';
import { Equipo } from '../../models/renta';

@Component({
  selector: 'app-registro-alquiler',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-alquiler.html',
  styleUrl: './registro-alquiler.css'
})
export class RegistroAlquiler implements OnInit {
  private fb = inject(FormBuilder);
  private rentaService = inject(RentaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  equipos: Equipo[] = [];
  errorRegla: string = '';

  formulario: FormGroup = this.fb.group({
    cliente: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
    equipoId: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    dias: [1, [Validators.required, Validators.min(1)]]
  });

  async ngOnInit() {
    await this.rentaService.inicializarDatos();
    this.equipos = await this.rentaService.obtenerEquipos();

    const idParam = this.route.snapshot.queryParamMap.get('equipoId');
    if (idParam) {
      this.formulario.patchValue({ equipoId: Number(idParam) });
    }
  }

  get equipoSeleccionado(): Equipo | undefined {
    const id = Number(this.formulario.value.equipoId);
    return this.equipos.find(e => e.id === id);
  }

  get totalEstimado(): number {
    if (!this.equipoSeleccionado) return 0;
    return this.equipoSeleccionado.precioDia * this.formulario.value.cantidad * this.formulario.value.dias;
  }

  async guardarAlquiler() {
    this.errorRegla = '';
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const eq = this.equipoSeleccionado;
    const cant = Number(this.formulario.value.cantidad);

    if (!eq || cant > eq.disponibles) {
      this.errorRegla = `Stock insuficiente. Solo quedan ${eq?.disponibles ?? 0} unidades disponibles de este equipo.`;
      return;
    }

    try {
      await this.rentaService.registrarAlquiler({
        cliente: this.formulario.value.cliente,
        telefono: this.formulario.value.telefono,
        equipoId: eq.id,
        equipoNombre: eq.nombre,
        cantidad: cant,
        dias: Number(this.formulario.value.dias),
        total: this.totalEstimado,
        fecha: new Date().toISOString(),
        estado: 'En curso'
      });

      this.router.navigate(['/alquileres']);
    } catch (err: any) {
      this.errorRegla = err.message || 'Error al guardar el alquiler.';
    }
  }
}