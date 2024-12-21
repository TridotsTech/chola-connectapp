import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeeReadonlyScreenComponent } from './employee-readonly-screen.component';

describe('EmployeeReadonlyScreenComponent', () => {
  let component: EmployeeReadonlyScreenComponent;
  let fixture: ComponentFixture<EmployeeReadonlyScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeReadonlyScreenComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeReadonlyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
