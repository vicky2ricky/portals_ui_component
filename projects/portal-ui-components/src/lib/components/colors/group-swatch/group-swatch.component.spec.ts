import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSwatchComponent } from './group-swatch.component';
const colorSelections = {
  colors: {
    grp1: ['#E95E6F', '#EF9453', '#F7C325'],
    grp2: ['#9635E2', '#C660D7', '#439AEB'],
    grp3: ['#897A5F', '#92CA4B', '#1AAE9F']
  },
  groupLabels: ['benchmark', 'actual', 'savings']
};
const colorData = [
  { label: 'Benchmark', color: '#9635E2' },
  { label: 'Actual', color: '#C660D7' },
  { label: 'Savings', color: '#439AEB' }
];
describe('Component: GroupSwatchComponent', () => {
  let component: GroupSwatchComponent;
  let fixture: ComponentFixture<GroupSwatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupSwatchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('changeColorSelection: Change the color selections', () => {
    component.availableColorSet = colorSelections['colors'];
    component.labels = colorSelections['groupLabels'];
    const key = 'grp1';
    component.showColorSwatch = true;
    spyOn(component.colorSelectionChange, 'emit');
    component.changeColorSelection(key);
    expect(component.selectedGroup).toBe(key);
    expect(component.showColorSwatch).toBeFalsy();
    expect(component.colorSelectionChange.emit)
      .toHaveBeenCalledWith({ colorSet: { benchmark: '#E95E6F', actual: '#EF9453', savings: '#F7C325' }, selectedGroup: 'grp1' })
  });

  it('changeColorSelection: Create color data labels', () => {
    component.availableColorSet = colorSelections['colors'];
    component.labels = colorSelections['groupLabels'];
    component.colorData = colorData;
    const key = 'grp1';
    component.showColorSwatch = true;
    spyOn(component.colorSelectionChange, 'emit');
    component.changeColorSelection(key);
    expect(component.selectedGroup).toBe(key);
    expect(component.showColorSwatch).toBeFalsy();
    expect(component.colorData[0]['color']).toBe('#E95E6F');
    expect(component.colorData[1]['color']).toBe('#EF9453');
    expect(component.colorData[2]['color']).toBe('#F7C325');
  });

  it('changeColorSelection: Should not create color data labels & color selections for empty data', () => {
    component.availableColorSet = null;
    component.labels = [];
    component.colorData = [];
    const key = 'grp1';
    component.showColorSwatch = true;
    spyOn(component.colorSelectionChange, 'emit');
    component.changeColorSelection(key);
    expect(component.selectedGroup).toBe(key);
    expect(component.showColorSwatch).toBeFalsy();
    expect(component.colorSelectionChange.emit)
      .toHaveBeenCalledWith({ colorSet: {}, selectedGroup: 'grp1' })
  });

  it('hostClicked: click on host element', () => {
    component.showColorSwatch = true;
    component.availableColorSet = colorSelections['colors'];
    component.isEdit = true;
    component.selectedGroup = 'grp1';
    fixture.detectChanges();
    const inputEl: HTMLElement = fixture.nativeElement.querySelector('.selectedColorList')
    const event = new Event('click', { bubbles: true });
    inputEl.dispatchEvent(event);
    expect(component.showColorSwatch).toBeFalsy();
  });

});
