import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SmartGroupTableComponent } from './smart-group-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Sort } from '@angular/material/sort';
import { MaterialModule } from '../../material.module';
import { PucComponentsModule } from '../components.module';



describe('SmartGroupTableComponent', () => {
    let component: SmartGroupTableComponent;
    let fixture: ComponentFixture<SmartGroupTableComponent>;
    const sgData = [
        {
            _id: 'SG1',
            dis: 'Smartgroup1',
            updatedAt: '2020-01-08T09:23:26.204Z',
            children: [
                {
                    dis: 'secret dev 239',
                    type: 'building',
                    _id: 'BU1',
                    ccuCount: 1,
                    zoneCount: 1,
                    children: [
                        {
                            _id: 'SY1',
                            gatewayRef: 'GW1',
                            dis: 'ji',
                            ahuRef: 'AH1',
                            siteRef: '@BU1',
                            type: 'system',
                            children: [
                                {
                                    _id: 'Z1',
                                    dis: 'z1',
                                    siteRef: '@BU1',
                                    ahuRef: '@AH1',
                                    gatewayRef: '',
                                    type: 'zone',
                                    children: [
                                        {
                                            _id: 'M1',
                                            roomRef: 'R1',
                                            dis: 'secret dev 239-VAV-7400',
                                            ahuRef: '@AH1',
                                            siteRef: '@BU1',
                                            type: 'module',
                                            selected: true
                                        }
                                    ]

                                }
                            ],

                        }
                    ],
                    address: {
                        geoAddr: 'kl',
                        geoCity: 'lk',
                        geoPostalCode: '517501',
                        geoState: 'kl',
                        geoCountry: 'lk'
                    },
                    selected: true
                },
                {
                    dis: 'building-2',
                    type: 'building',
                    _id: 'BU1',
                    ccuCount: 2,
                    zoneCount: 2,
                    children: [
                        {
                            _id: 'SY1',
                            gatewayRef: 'GW1',
                            dis: 'ji',
                            ahuRef: 'AH1',
                            siteRef: '@BU1',
                            type: 'system',
                            children: [
                                {
                                    _id: 'Z1',
                                    dis: 'z1',
                                    siteRef: '@BU1',
                                    ahuRef: '@AH1',
                                    gatewayRef: '',
                                    type: 'zone',
                                    children: [
                                        {
                                            _id: 'M1',
                                            roomRef: 'R1',
                                            dis: 'secret dev 239-VAV-7400',
                                            ahuRef: '@AH1',
                                            siteRef: '@BU1',
                                            type: 'module',
                                            selected: true
                                        }
                                    ]

                                }
                            ],

                        }
                    ],
                    address: {
                        geoAddr: 'kl',
                        geoCity: 'lk',
                        geoPostalCode: '517501',
                        geoState: 'kl',
                        geoCountry: 'lk'
                    },
                    selected: true
                },

            ]
        }
    ]

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PucComponentsModule, HttpClientTestingModule, MaterialModule, RouterTestingModule,
                BrowserAnimationsModule],
            declarations: []
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SmartGroupTableComponent);
        component = fixture.componentInstance;
        component._data = sgData;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('on selecting the smargroup', fakeAsync(() => {
        const event = { value: true };
        const item = sgData[0];
        component.onChange(item, 0, '', event);
        tick(1);
        expect(item['childrenCount']).toBe(8);
        expect(item['selected']).toBeTruthy();
    }))
    it('on deselecting the smargroup', fakeAsync(() => {
        const event = { value: false };
        const item = sgData[0];
        component.onChange(item, 0, '', event);
        tick(2);
        expect(item['fill']).toBe(0);
        expect(item['selected']).toBeFalsy();
    }))
    it('on selecting the building', fakeAsync(() => {
        const event = { value: true };
        const item = sgData[0]['children'][0];
        component.onChange(item, 0, sgData[0], event);
        tick(3);
        expect(item['selectedChildrenCount']).toBe(3);
        expect(item['fill']).toBe(100);
        expect(item['selected']).toBeTruthy();
    }))
    it('on de selecting the building', fakeAsync(() => {
        const event = { value: false };
        const item = sgData[0]['children'][0];
        component.onChange(item, 0, sgData[0], event);
        tick(4);
        expect(item['selectedChildrenCount']).toBe(0);
        expect(item['fill']).toBe(0);
        expect(item['selected']).toBeFalsy();
    }))
    it('on selecting the ccu', fakeAsync(() => {
        const event = { value: true };
        const item = sgData[0]['children'][0]['children'][0];
        component.onChange(item, 0, sgData[0]['children'][0], event);
        tick(5);
        expect(item['selectedChildrenCount']).toBe(2);
        expect(item['fill']).toBe(100);
        expect(item['selected']).toBeTruthy();
    }))
    it('on de selecting the ccu', fakeAsync(() => {
        const event = { value: false };
        const item = sgData[0]['children'][0]['children'][0];
        component.onChange(item, 0, sgData[0]['children'][0], event);
        tick(6);
        expect(item['selectedChildrenCount']).toBe(0);
        expect(item['fill']).toBe(0);
        expect(item['selected']).toBeFalsy();
    }))

    it('on selecting the zone', fakeAsync(() => {
        const event = { value: true };
        const item = sgData[0]['children'][0]['children'][0]['children'][0];
        component.onChange(item, 0, sgData[0]['children'][0]['children'][0], event);
        tick(7);
        expect(item['selectedChildrenCount']).toBe(1);
        expect(item['fill']).toBe(100);
        expect(item['selected']).toBeTruthy();
    }))
    it('on de selecting the zone', fakeAsync(() => {
        const event = { value: false };
        const item = sgData[0]['children'][0]['children'][0]['children'][0];
        component.onChange(item, 0, sgData[0]['children'][0]['children'][0], event);
        tick(8);
        expect(item['selectedChildrenCount']).toBe(0);
        expect(item['fill']).toBe(0);
        expect(item['selected']).toBeFalsy();
    }))
    it('on calling resetdata', fakeAsync(() => {
        const item = sgData[0]['children'][0];
        item['selected'] = true;
        component.resetData(item);
        tick(9);
        expect(item['fill']).toBe(0);
    }))
    it('on toggling arrow button show or hide children list', fakeAsync(() => {
        const item = sgData[0]['children'][0];
        component.toggle(item);
        tick(10);
        expect(item['isExpanded']).toBeTruthy();
    }));
    it('on toggling arrow button show or hide children list', () => {
        const item = sgData[0];
        component.toggle(item);
        expect(item['isExpanded']).toBeTruthy();
    })
    it('on selecting select all zones option ', fakeAsync(() => {
        const item = sgData[0]['children'][0]['children'][0];
        component.toggleZones(item, 0, true, { value: true });
        tick(11);
        expect(item['isSelectedZones']).toBeTruthy();
        expect(item['selectedChildrenCount']).toBe(2);

    }));
    it('on de selecting select all the zones option', fakeAsync(() => {
        const item = sgData[0]['children'][0]['children'][0];
        component.toggleZones(item, 0, true, { value: false });
        tick(12);
        expect(item['isSelectedZones']).toBeFalsy();
        expect(item['selectedChildrenCount']).toBe(0);
    }));
    it('on selecting Exclude all the zones option', fakeAsync(() => {
        const item = sgData[0]['children'][0]['children'][0];
        component.toggleZones(item, 0, false, { value: true });
        tick(12);
        expect(item['isUnSelectedZones']).toBeTruthy();
    }));
    it('on de selecting Exclude all the zones option', fakeAsync(() => {
        const item = sgData[0]['children'][0]['children'][0];
        component.toggleZones(item, 0, false, { value: false });
        tick(13);
        expect(item['selectedChildrenCount']).toBe(0);
        expect(item['isUnSelectedZones']).toBeFalsy();
    }));
    it('on sorting', fakeAsync(() => {
        const sort: Sort = { active: 'ccuCount', direction: 'desc' };
        component.sortData(sort);
        expect(component._data[0]['children'][0].dis).toBe('building-2')
    }))

});
