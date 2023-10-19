import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryHistoryComponent } from './employee-salary-history.component';

describe('EmployeeSalaryHistoryComponent', () => {
  let component: EmployeeSalaryHistoryComponent;
  let fixture: ComponentFixture<EmployeeSalaryHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSalaryHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
