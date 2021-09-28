import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TunerListComponent } from './tuner-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SiteService } from '../../services/site.service';
import { MaterialModule } from './../../material.module';
import { PucComponentsModule } from '../components.module';
import { ConfigurationService } from '../../services/configuration.service';
import { AlertService } from '../../services/alert.service';
import { EnumService } from '../../services/enum.service';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
let store = {};
const tuners = [
    {
        defaultVal: 2,
        incrementVal: 1,
        isLoading: false,
        maxVal: 30,
        minVal: 0,
        name: 'staticPressureTimeInterval',
        tunerGroup: 'VAV',
        unit: 'm'
    },
    {
        defaultVal: 2,
        incrementVal: 1,
        isLoading: false,
        maxVal: 30,
        minVal: 0,
        name: 'co2',
        tunerGroup: 'DAB',
        unit: 'F'
    }
];
const siteInfo = {
    siteDetails: {
        dis: 'test',
        geoAddr: 'IN',
        geoState: 'KA',
        geoPostalCode: '560037',
        geoCity: 'Bangalore',
        geoCountry: 'India'
    },
    ccuName: 'test_ccu',
    siteRef: 'site1',
    ahuRef: 'ahu1',
    roomRef: 'room1',
    zoneName: 'test_zone'
};
const tunerValues = [{
    name: 'stage3CoolingAirflowTempLowerOffset',
    values: [{
        _id: 'id1', name: 'dinesh_energy-SystemEquip-stage3CoolingAirflowTempLowerOffset',
        unit: '°F', minVal: -150, maxVal: 0,
        incrementVal: 1, tunerGroup: 'ALERT', isLoading: false, defaultVal: '-25',
        newVal: '-25', isValueChanged: true, refId: '@ref1'
    }]
}];
class MockUserService extends UserService {
    getDisplayId() {
        return 'web_dinesh';
    }
}

const alertServiceSpy = {
    success: jasmine.createSpy('success').and.returnValue(true),
    warning: jasmine.createSpy('warning').and.returnValue(false),
};

const siteServiceSpy = {
    updateBulkWritablePointData: jasmine.createSpy('updateBulkWritablePointData').and.returnValue(of([])),
    getTunerPointValues: jasmine.createSpy('getTunerPointValues').and.returnValue(of([]))
};

const configServiceSpy = {
    getConfig: jasmine.createSpy('getConfig').and.returnValue({})
};

class MockLocalStorage {
    getItem = (key: string): string => {
        return key in store ? store[key] : null;
    }
    setItem = (key: string, value: string) => {
        store[key] = `${value}`;
    }
    removeItem = (key: string) => {
        delete store[key];
    }
    clear = () => {
        store = {};
    }
}

describe('Component:TunerListComponent', () => {
    let component: TunerListComponent;
    let fixture: ComponentFixture<TunerListComponent>;
    let overlayContainerElement: HTMLElement;
    let siteService: SiteService;
    let dialog: MatDialog;
    let enumService: EnumService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule,
                MaterialModule,
                PucComponentsModule,
                BrowserAnimationsModule],
            providers: [
                {
                    provide: OverlayContainer, useFactory: () => {
                        overlayContainerElement = document.createElement('div');
                        return { getContainerElement: () => overlayContainerElement };
                    }
                },
                {
                    provide: UserService,
                    useClass: MockUserService
                },
                {
                    provide: 'LOCALSTORAGE',
                    useClass: MockLocalStorage
                },
                {
                    provide: SiteService,
                    useValue: siteServiceSpy
                },
                {
                    provide: ConfigurationService,
                    useValue: configServiceSpy
                },
                {
                    provide: AlertService,
                    useValue: alertServiceSpy
                },
                {
                    provide: MatDialogRef, useValue: {
                        updatePosition() { return true; },
                        afterClosed() { return of([]); },
                        componentInstance: {
                            title: 'Confirm', htmlContent: '<div>Test</div>'
                        }, close() { return true; }
                    }
                },
                {
                    provide: MatDialogRef, useValue: {
                        updatePosition() { return true; },
                        afterClosed() { return of([]); },
                    }
                },
            ],
            declarations: []
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TunerListComponent);
        component = fixture.componentInstance;
        siteService = fixture.debugElement.injector.get(SiteService);
        enumService = fixture.debugElement.injector.get(EnumService);
        dialog = fixture.debugElement.injector.get(MatDialog);
        component.level = 'building';
        // userService = fixture.debugElement.injector.get(UserService);
        fixture.detectChanges();
    });
    afterEach(() => {

        component = null;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('reset: reset the updated tuner', () => {
        const item = { name: 'testTuner1', newVal: '2', isValueChanged: true };
        component.reset(item);
        expect(item.hasOwnProperty('newVal')).toBeFalsy();
        expect(item.hasOwnProperty('isValueChanged')).toBeFalsy();
    });
    it('groupData: group the data by type', () => {
        component.hasGroup = true;
        component._tuners = [
            { tunerGroup: 'dab', name: 'dabTest1', _id: 'dab1' },
            { tunerGroup: 'vav', name: 'vavTest1', _id: 'vav1' },
            { tunerGroup: 'vav', name: 'vavTest2', _id: 'vav2' },
            { name: 'timeTest2', _id: 'time1' }
        ];
        component.groupData();
        const dabTuners: Array<any> = component.tunersGroup['dab'];
        const vavTuners: Array<any> = component.tunersGroup['vav'];
        const otherTuners: Array<any> = component.tunersGroup['other'];
        expect(dabTuners.length).toBe(1);
        expect(vavTuners.length).toBe(2);
        expect(otherTuners.length).toBe(1);
    });

    it('update: emit selected tuners if url contains `tuners`', () => {
        component.parentUrl = 'tuners';
        tuners[0]['isValueChanged'] = true;
        component._tuners = tuners;
        spyOn(component.onTunerApply, 'emit');
        component.update();
        expect(component.onTunerApply.emit).toHaveBeenCalled();
    });

    it('update: show warning messgae updating without tuner changes', fakeAsync(() => {
        component.parentUrl = 'tuners';
        component._tuners = tuners;
        const spy = alertServiceSpy.warning.and.returnValue(true);
        component.update();
        tick();
        expect(spy).toHaveBeenCalled();
    }));

    it('update: listout tuners & building information in popup', fakeAsync(() => {
        component.parentUrl = 'heatmap';
        component.siteInfo = siteInfo;
        tuners[0]['isValueChanged'] = true;
        component._tuners = tuners;
        siteServiceSpy.getTunerPointValues.and.returnValue(of([]));
        spyOn(component, 'updateValues').and.callThrough();
        const updateSpy = spyOn(dialog, 'open')
            .and
            .returnValue(
                { afterClosed: () => of('apply'), updatePosition: () => { } } as MatDialogRef<any>
            );
        component.update();
        tick();
        expect(updateSpy).toHaveBeenCalled();
    }));

    it('getValue: make loading false for ', () => {
        const item = { isLoading: true };
        const res = component.getValue(item);
        expect(typeof res).toBe('function');
    });

    it('edit: get selected tuner details', () => {
        const item = tuners[0];
        component.parentUrl = 'tuners';
        spyOn(component.onEditClick, 'emit');
        spyOn(component, 'openModal').and.callThrough();
        component.edit(item);
        expect(component.selectedTuner.name).toBe('staticPressureTimeInterval');
        expect(component.onEditClick.emit).toHaveBeenCalledWith(true);
    });

    it('edit: get selected tuner details from heatmap page', () => {
        const item = tuners[0];
        component.parentUrl = 'heatmap';
        spyOn(component.onEditClick, 'emit');
        const openModalSpy = spyOn(component, 'openModal').and.callFake(() => {
            return true;
        });
        component.edit(item);
        expect(openModalSpy).toHaveBeenCalled();
    });

    it('openDialog: open warning popup', fakeAsync(() => {
        const openDialogSpy = spyOn(dialog, 'open')
            .and
            .returnValue(
                {
                    afterClosed: () => of('apply'),
                    componentInstance: { title: 'Confirm', type: 'dialog', htmlContent: '<div>Test</div>' },
                    updatePosition: () => { }
                } as MatDialogRef<any>
            );
        component.openDialog();
        tick();
        expect(openDialogSpy).toHaveBeenCalled();
    }));

    it('openModal: open override priority modal', fakeAsync(() => {
        const overrideSpy = spyOn(dialog, 'open')
            .and
            .returnValue(
                {
                    afterClosed: () => of({ data: { newVal: '20', isValueChanged: true } }),
                    componentInstance: { title: 'Confirm', type: 'dialog', htmlContent: '<div>Test</div>' },
                    updatePosition: () => { }
                } as MatDialogRef<any>
            );
        component.siteInfo = siteInfo;
        component.openModal();
        tick();
        expect(overrideSpy).toHaveBeenCalled();
    }));

    it('updateValues: udpate changed tuner values', fakeAsync(() => {
        siteServiceSpy.updateBulkWritablePointData.and.returnValue(of('ok'));
        component._tuners = tuners;
        component.updateValues(tunerValues);
        spyOn(component.isTunerUpdated, 'emit');
        tick();
        expect(component.isTunerUpdated.emit).toHaveBeenCalledWith(true);
    }));
});
