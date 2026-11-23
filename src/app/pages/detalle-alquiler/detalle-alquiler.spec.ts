import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleAlquiler } from './detalle-alquiler';

describe('DetalleAlquiler', () => {
  let component: DetalleAlquiler;
  let fixture: ComponentFixture<DetalleAlquiler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAlquiler],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleAlquiler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
