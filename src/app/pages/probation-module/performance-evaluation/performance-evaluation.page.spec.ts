import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceEvaluationPage } from './performance-evaluation.page';

describe('PerformanceEvaluationPage', () => {
  let component: PerformanceEvaluationPage;
  let fixture: ComponentFixture<PerformanceEvaluationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PerformanceEvaluationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
