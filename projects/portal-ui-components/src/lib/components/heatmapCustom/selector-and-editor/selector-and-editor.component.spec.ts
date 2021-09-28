import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorAndEditorComponent } from './selector-and-editor.component';

describe('SelectorAndEditorComponent', () => {
  let component: SelectorAndEditorComponent;
  let fixture: ComponentFixture<SelectorAndEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorAndEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorAndEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
