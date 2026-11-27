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
    { id: 1, nombre: 'Guitarra Eléctrica Fender Stratocaster', descripcion: 'Guitarra eléctrica de alta calidad, ideal para rock y metal.', categoria: 'Cuerdas', precioDia: 80, disponibles: 3, totalStock: 3, imagen: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=500&q=80' },
    { id: 2, nombre: 'Piano Digital Yamaha P-125', descripcion: 'Piano digital de alta calidad, ideal para música clásica y pop.', categoria: 'Teclados', precioDia: 120, disponibles: 2, totalStock: 2, imagen: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=500&q=80' },
    { id: 3, nombre: 'Batería Acústica Pearl Export', descripcion: 'Batería acústica de alta calidad, ideal para música en vivo.', categoria: 'Percusión', precioDia: 180, disponibles: 2, totalStock: 2, imagen: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=500&q=80' },
    { id: 4, nombre: 'Consola Mezcladora Behringer 12 Canales', descripcion: 'Consola de mezcla digital de 12 canales, ideal para estudios y eventos.', categoria: 'Audio', precioDia: 150, disponibles: 4, totalStock: 4, imagen: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=500&q=80' },
    { id: 5, nombre: 'Bajo Eléctrico Ibanez 4 Cuerdas', descripcion: 'Bajo eléctrico de 4 cuerdas de alta calidad, ideal para rock y jazz.', categoria: 'Cuerdas', precioDia: 75, disponibles: 2, totalStock: 2, imagen: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=500&q=80' },
    {
    id: 6,
    nombre: 'Teclado MIDI Akai Professional MPK Mini',
    descripcion: 'Teclado MIDI compacto de 25 teclas, ideal para producción musical y control de software.',
    categoria: 'Teclados',
    precioDia: 60,
    disponibles: 5,
    totalStock: 5,
    imagen: 'https://soundium.com/cdn/shop/files/akai-professional-mpk-mini-play-mk3-hero.jpg?v=1782146848'
  },
  {
    id: 7,
    nombre: 'Piano Arranger Korg PA600',
    descripcion: 'Teclado arranger profesional de 61 teclas sensibles a la velocidad con pantalla táctil a color TouchView, más de 950 sonidos integrados y parlantes estéreo incorporados.',
    categoria: 'Teclados',
    precioDia: 180,
    disponibles: 2,
    totalStock: 2,
    imagen: 'https://cdn.korg.com/bo/products/upload/54b1ba3bdb756efddd19c2cc976ddc7f_sp.png'
  },
  {
    id: 8,
    nombre: 'Guitarra Acústica',
    descripcion: 'Guitarra acústica de 6 cuerdas con caja de resonancia de madera, diapasón de 20 trastes y clavijero de afinación precisa. Sonido cálido y equilibrado.',
    categoria: 'Cuerdas',
    precioDia: 50,
    disponibles: 4,
    totalStock: 4,
    imagen: 'https://hub.yamaha.com/wp-content/uploads/2015/05/DSC00195-min-1-scaled.jpg'
  },
  {
    id: 9,
    nombre: 'Batería de Caja (Tarola / Redoblante)',
    descripcion: 'Caja de batería acústica de 14 pulgadas con aros reforzados, tensor de entorchado ajustable y parche de alta resistencia. Golpe definido y brillante.',
    categoria: 'Percusión',
    precioDia: 45,
    disponibles: 3,
    totalStock: 3,
    imagen: 'https://static.wixstatic.com/media/009440_d8f9d6c899a843f1874273bc656b3672~mv2.jpg/v1/fill/w_640,h_588,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/009440_d8f9d6c899a843f1874273bc656b3672~mv2.jpg'
  },
  {
    id: 10,
    nombre: 'Parlantes Profesionales 15"',
    descripcion: 'Parlante profesional de 15 pulgadas de 2 vías de alta potencia con carcasa resistente y soporte para trípode. Ideal para eventos y escenarios.',
    categoria: 'Sonido',
    precioDia: 120,
    disponibles: 6,
    totalStock: 6,
    imagen: 'https://rukminim3.flixcart.com/image/480/480/xif0q/speaker/pa-speaker/z/w/u/15-inch-400-watts-v3-400-dj-maker-original-imagxtqfb5fgz276.jpeg?q=90'
  },
  {
    id: 11,
    nombre: 'Parlante Bajo (Subwoofer)',
    descripcion: 'Subwoofer de refuerzo de graves de alta potencia con cono reforzado y bobina de alta resistencia térmica para frecuencias bajas profundas.',
    categoria: 'Sonido',
    precioDia: 150,
    disponibles: 4,
    totalStock: 4,
    imagen: 'https://www.soundtown.com/cdn/shop/files/CARME-112BPW15SPW-Powered-12-inch-PA-Speaker-System-15-inch-Subwoofer-Combo-Set-Black_1024x1024.jpg?v=1718389919'
  },
  {
    id: 12,
    nombre: 'Mezcladora de Audio Multicanal',
    descripcion: 'Consola mezcladora con preamplificadores de micrófono XLR, entradas de línea estéreo, ecualizador por canal y salida principal balanceada.',
    categoria: 'Sonido',
    precioDia: 130,
    disponibles: 3,
    totalStock: 3,
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/SSL_SL9000J_%2872ch%29_%40_The_Cutting_Room_Recording_Studios%2C_NYC.jpg'
  },
  {
    id: 13,
    nombre: 'Bocinas / Monitores de Escenario',
    descripcion: 'Bocina acústica de rango completo con driver de compresión para agudos y rejilla metálica frontal. Adecuada como monitor de piso o refuerzo.',
    categoria: 'Sonido',
    precioDia: 80,
    disponibles: 4,
    totalStock: 4,
    imagen: 'https://electromarket.co.uk/media/wysiwyg/page-content/guide/Floor_Monitor_Speaker.webp'
  },
  {
    id: 14,
    nombre: 'Micrófono Dinámico Vocal',
    descripcion: 'Micrófono dinámico cardioide de mano con cápsula unidireccional que reduce acoples, cuerpo metálico resistente y conector XLR estándar.',
    categoria: 'Sonido',
    precioDia: 30,
    disponibles: 8,
    totalStock: 8,
    imagen: 'https://files.ekmcdn.com/bowm02/images/akg-d5-dynamic-vocal-microphone-3468-p.png?w=1000&h=1000&v=4284C42E-62E5-4A00-AFDE-9C375C6F9C55'
  },
  {
    id: 15,
    nombre: 'Piano Grande (Piano de Cola)',
    descripcion: 'Piano acústico de cola de concierto con 88 teclas contrapesadas, tabla armónica de abeto, tres pedales de expresión y tapa abatible.',
    categoria: 'Teclados',
    precioDia: 450,
    disponibles: 1,
    totalStock: 1,
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Steinway_Vienna_002.JPG'
  },
  {
    id: 16,
    nombre: 'Saxofón Alto',
    descripcion: 'Saxofón alto en Mi bemol (Eb) con cuerpo de latón lacado dorado, llaves ergonómicas con incrustaciones nacaradas y boquilla completa.',
    categoria: 'Vientos',
    precioDia: 110,
    disponibles: 2,
    totalStock: 2,
    imagen: 'https://www.selmer.fr/cdn/shop/products/sax_alto_Reference_54_verni.png?v=1678796931&width=1600'
  },
  {
    id: 17,
    nombre: 'Clarinete Soprano Bb',
    descripcion: 'Clarinete soprano en Si bemol (Bb) de 17 llaves con cuerpo negro de acabado mate y llaves niqueladas de respuesta rápida y afinación estable.',
    categoria: 'Vientos',
    precioDia: 85,
    disponibles: 3,
    totalStock: 3,
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Leitner%2BKraus_410_320.png'
  }

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