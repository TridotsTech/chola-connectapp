import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewVoluntaryPfComponent } from './new-voluntary-pf.component';

describe('NewVoluntaryPfComponent', () => {
  let component: NewVoluntaryPfComponent;
  let fixture: ComponentFixture<NewVoluntaryPfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVoluntaryPfComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewVoluntaryPfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
