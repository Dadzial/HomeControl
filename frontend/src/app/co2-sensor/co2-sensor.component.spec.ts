import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CO2SensorComponent } from './co2-sensor.component';

describe('CO2SensorComponent', () => {
  let component: CO2SensorComponent;
  let fixture: ComponentFixture<CO2SensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CO2SensorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CO2SensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
