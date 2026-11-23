import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroAlquiler } from './registro-alquiler';

describe('RegistroAlquiler', () => {
  let component: RegistroAlquiler;
  let fixture: ComponentFixture<RegistroAlquiler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAlquiler],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroAlquiler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
