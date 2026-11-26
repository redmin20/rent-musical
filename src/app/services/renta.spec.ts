import { Injectable } from '@angular/core';
import { Alquiler, Equipo } from '../models/renta';

@Injectable({
  providedIn: 'root'
})
export class RentaService {
  private dbName = 'RentaMusicalDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // Catálogo inicial (se inserta una sola vez si la BD está vacía)
  private equiposIniciales: Equipo[] = [
    { id: 1, nombre: 'Guitarra Eléctrica Fender Stratocaster', categoria: 'Cuerdas', precioDia: 80, disponibles: 3, totalStock: 3, imagen: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=500&q=80' },
    { id: 2, nombre: 'Piano Digital Yamaha P-125', categoria: 'Teclados', precioDia: 120, disponibles: 2, totalStock: 2, imagen: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=500&q=80' },
    { id: 3, nombre: 'Batería Acústica Pearl Export', categoria: 'Percusión', precioDia: 180, disponibles: 2, totalStock: 2, imagen: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=500&q=80' },
    { id: 4, nombre: 'Consola Mezcladora Behringer 12 Canales', categoria: 'Audio', precioDia: 150, disponibles: 4, totalStock: 4, imagen: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=500&q=80' },
    { id: 5, nombre: 'Bajo Eléctrico Ibanez 4 Cuerdas', categoria: 'Cuerdas', precioDia: 75, disponibles: 2, totalStock: 2, imagen: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=500&q=80' }
  ];

  // Abre o crea la base de datos IndexedDB
  private async abrirDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;
        if (!db.objectStoreNames.contains('equipos')) {
          db.createObjectStore('equipos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('alquileres')) {
          db.createObjectStore('alquileres', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db!);
      };

      request.onerror = () => reject('Error al abrir IndexedDB');
    });
  }

  // Carga los equipos iniciales solo si aún no existen en IndexedDB
  async inicializarDatos(): Promise<void> {
    const db = await this.abrirDB();
    const equiposActuales = await this.obtenerEquipos();

    if (equiposActuales.length === 0) {
      const tx = db.transaction('equipos', 'readwrite');
      const store = tx.objectStore('equipos');
      for (const eq of this.equiposIniciales) {
        store.put(eq);
      }
      return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
      });
    }
  }

  // Lee todos los equipos
  async obtenerEquipos(): Promise<Equipo[]> {
    const db = await this.abrirDB();
    return new Promise((resolve) => {
      const tx = db.transaction('equipos', 'readonly');
      const req = tx.objectStore('equipos').getAll();
      req.onsuccess = () => resolve(req.result);
    });
  }

  // Guarda un alquiler y resta las unidades disponibles
  async registrarAlquiler(alquiler: Alquiler): Promise<void> {
    const db = await this.abrirDB();
    const equipos = await this.obtenerEquipos();
    const equipo = equipos.find((e) => e.id === alquiler.equipoId);

    if (!equipo || equipo.disponibles < alquiler.cantidad) {
      throw new Error('No hay suficientes unidades disponibles.');
    }

    equipo.disponibles -= alquiler.cantidad;

    const tx = db.transaction(['equipos', 'alquileres'], 'readwrite');
    tx.objectStore('equipos').put(equipo);
    tx.objectStore('alquileres').add(alquiler);

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }

  // Lee todos los alquileres registrados
  async obtenerAlquileres(): Promise<Alquiler[]> {
    const db = await this.abrirDB();
    return new Promise((resolve) => {
      const tx = db.transaction('alquileres', 'readonly');
      const req = tx.objectStore('alquileres').getAll();
      req.onsuccess = () => resolve(req.result);
    });
  }

  // Busca un alquiler específico por su ID
  async obtenerAlquilerPorId(id: number): Promise<Alquiler | undefined> {
    const db = await this.abrirDB();
    return new Promise((resolve) => {
      const tx = db.transaction('alquileres', 'readonly');
      const req = tx.objectStore('alquileres').get(id);
      req.onsuccess = () => resolve(req.result);
    });
  }

  // Cambia estado a 'Devuelto' y suma de vuelta las unidades al catálogo
  async procesarDevolucion(id: number): Promise<void> {
    const db = await this.abrirDB();
    const alquiler = await this.obtenerAlquilerPorId(id);
    if (!alquiler || alquiler.estado === 'Devuelto') return;

    const equipos = await this.obtenerEquipos();
    const equipo = equipos.find((e) => e.id === alquiler.equipoId);

    alquiler.estado = 'Devuelto';
    if (equipo) {
      equipo.disponibles += alquiler.cantidad;
    }

    const tx = db.transaction(['equipos', 'alquileres'], 'readwrite');
    tx.objectStore('alquileres').put(alquiler);
    if (equipo) {
      tx.objectStore('equipos').put(equipo);
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }
}