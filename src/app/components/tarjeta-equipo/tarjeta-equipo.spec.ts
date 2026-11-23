import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaEquipo } from './tarjeta-equipo';

describe('TarjetaEquipo', () => {
  let component: TarjetaEquipo;
  let fixture: ComponentFixture<TarjetaEquipo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaEquipo],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaEquipo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
