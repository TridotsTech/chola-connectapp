import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeavePreviewWithdrawFormComponent } from './leave-preview-withdraw-form.component';

describe('LeavePreviewWithdrawFormComponent', () => {
  let component: LeavePreviewWithdrawFormComponent;
  let fixture: ComponentFixture<LeavePreviewWithdrawFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavePreviewWithdrawFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeavePreviewWithdrawFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
