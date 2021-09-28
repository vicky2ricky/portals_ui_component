import { Component, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OAOArcDirective } from './oao-arc.directive';
import * as d3 from 'd3';

@Component({
  template: `<div id ="fName" ui-oaoArc></div>`
})
class TestComponent {
}

class MockElementRef extends ElementRef {
  constructor() { super(undefined); }
  // nativeElement = {};
}

describe('AsyncLoaderDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let des;
  let elRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, OAOArcDirective],
      providers: [
        OAOArcDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    des = TestBed.inject(OAOArcDirective);
    elRef = TestBed.inject(ElementRef);
  }));

  it('should create an instance', () => {
    expect(des).toBeTruthy();
  });

  it('should createArcs part#1', () => {
    des.options = {
      size: 20,
      scale: {
        enabled: true
      },
      skin: {
        type: 'torn'
      },
      barWidth: 10,
      trackWidth: 20
    };

    des.createArcs();

    expect(des.trackArc).toBeTruthy();
  });

  it('should createArcs part#2', () => {
    des.options = {
      size: 20,
      scale: {
        enabled: true
      },
      skin: {
        type: 'torn'
      },
      barWidth: 20,
      trackWidth: 10
    };

    des.createArcs();

    expect(des.trackArc).toBeTruthy();
  });

  it('should createArcs part#3', () => {
    des.options = {
      size: 20,
      scale: {
        enabled: true
      },
      skin: {
        type: 'torn'
      },
      barWidth: 10,
      trackWidth: 20,
      bgColor: 'red',
      bgFull: true
    };

    des.createArcs();

    expect(des.trackArc).toBeTruthy();
  });

  it('should createArcs part#4', () => {
    des.options = {
      size: 20,
      scale: {
        enabled: true
      },
      skin: {
        type: 'torn'
      },
      barWidth: 10,
      trackWidth: 20,
      bgColor: 'red',
      bgFull: false
    };

    des.createArcs();

    expect(des.trackArc).toBeTruthy();
  });

  it('setValue should render', () => {
    des.value = 10;
    des.options = {
      min: 10,
      step: 0.1,
      displayInput: true,
      inputFormatter: () => { }
    };
    des.changeArc = {
      endAngle: (data) => true
    };
    des.valueArc = {
      endAngle: (data) => true
    };

    des.setValue(10);
    expect(des.value).toBe(10);
  });

  it('drawArc should render', () => {
    const svg = d3.select('body').append('svg')
      .attr('height', '500')
      .attr('width', '500')
      .attr('style', 'color:red')
      .append('g')
      .attr('transform', 'translate(\'0, 0\')');

    des.options = {
      size: 10
    };
    expect(des.drawArc(svg, '', '', '')).toBe(svg);
  });

  it('radiansToValue: should return value', () => {
    expect(parseInt(des.radiansToValue(10, 20, 30, 40, 50), 10)).toEqual(839);
  });

  it('ngOnInit: should set vals', () => {
    des.ngOnInit();

    expect(des.inDrag).toEqual(true);
  });
});
