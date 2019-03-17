import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwWidgetComponent } from './pw-widget.component';

describe('PwWidgetComponent', () => {
  let component: PwWidgetComponent;
  let fixture: ComponentFixture<PwWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
