import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.isActive = true;
    component.isFixed = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    const event = new KeyboardEvent('keypress', {
      key: 'Escape',
    });
    Object.defineProperty(event, 'target', { value: { classname: 'modal modal--show modal--fixed' } });
    Object.defineProperty(event, 'keyCode', { value: 27 });
    fixture.detectChanges();
    component.keyEvent(event);
    expect(component).toBeTruthy();
  });

  // it('should create', () => {
  //   const event = new Event('click');
  //   fixture.detectChanges();
  //   component.clickOut(event);
  //   expect(component).toBeTruthy();
  // });

  it('hide modal', () => {
    component.hideModal();
    expect(component).toBeTruthy();
  });
});
