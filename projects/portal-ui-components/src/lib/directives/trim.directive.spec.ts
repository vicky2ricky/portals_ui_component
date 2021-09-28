import { TrimDirective } from './trim.directive';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input id ="fName" type="text" trim="blur" />
 <input id ="invalidoption" type="text" trim="test" />
 <input id ="trimoninput" type="text" trim />
 <input id ="trifalse" type="text" trim=false />`
})
class TestFocusComponent {
}

describe('TrimDirective', () => {
  let component: TestFocusComponent;
  let fixture: ComponentFixture<TestFocusComponent>;
  let des;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFocusComponent, TrimDirective]
    });
    fixture = TestBed.createComponent(TestFocusComponent);
    component = fixture.componentInstance;
    des = fixture.debugElement.queryAll(By.directive(TrimDirective));
  }));

  it('trim: should remove trailing and leading whitespaces on blur', async(() => {
    const firstNameEl = des[0].nativeElement;
    firstNameEl.value = 'John ';
    const event = document.createEvent('Event');
    event.initEvent('blur', false, false);
    firstNameEl.dispatchEvent(event);
    fixture.detectChanges();
    expect(firstNameEl.value).toBe('John');
  }));

  it('invalid trim: should retain the value as is in case of invalid trim param', async(() => {
    const invalidOptionEL = des[1].nativeElement;
    invalidOptionEL.value = 'John ';
    const event = document.createEvent('Event');
    event.initEvent('blur', false, false);
    invalidOptionEL.dispatchEvent(event);
    fixture.detectChanges();
    expect(invalidOptionEL.value).toBe('John ');
  }));

  it('trim: Should not allow space in input', async(() => {
    const elem = des[2].nativeElement;
    elem.value = ' test ';
    elem.focus();
    const event = document.createEvent('Event');
    event.initEvent('input', false, false);
    elem.dispatchEvent(event);
    fixture.detectChanges();
    expect(elem.value).toEqual('test');
  }));

  it('invalid trim: should retain the value as is in case of trim false', async(() => {
    const trimFalse = des[3].nativeElement;
    trimFalse.value = 'John ';
    const event = document.createEvent('Event');
    event.initEvent('blur', false, false);
    trimFalse.dispatchEvent(event);
    fixture.detectChanges();
    expect(trimFalse.value).toBe('John ');
  }));
});
