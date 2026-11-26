export interface Equipo {
  id: number;
  nombre: string;
  categoria: string; // 
  precioDia: number;
  disponibles: number;
  totalStock: number;
  imagen: string;
}

export interface Alquiler {
  id?: number; // 
  cliente: string;
  telefono: string;
  equipoId: number;
  equipoNombre: string;
  cantidad: number;
  dias: number;
  total: number;
  fecha: string;
  estado: 'En curso' | 'Devuelto';
}