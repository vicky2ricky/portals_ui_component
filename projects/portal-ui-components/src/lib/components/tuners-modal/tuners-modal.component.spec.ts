import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TunersModalComponent } from './tuners-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumService } from '../../services/enum.service';
import { PucComponentsModule } from '../components.module';
import { MaterialModule } from '../../material.module';
describe('Component: TunersModalComponent', () => {
  let component: TunersModalComponent;
  let fixture: ComponentFixture<TunersModalComponent>;
  let overlayContainerElement: HTMLElement;
  let dialog: MatDialogRef<any>;
  let enumService: EnumService;
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
              selected: true,
              children: [
                {
                  _id: 'Z1',
                  dis: 'z1',
                  siteRef: '@BU1',
                  ahuRef: '@AH1',
                  gatewayRef: '',
                  type: 'zone',
                  selected: true,
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
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PucComponentsModule, HttpClientTestingModule, MaterialModule, RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        },
        { provide: MatDialogRef, useValue: { close() { return true; } } },
        { provide: MAT_DIALOG_DATA, useValue: {} },

      ],
      declarations: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TunersModalComponent);
    component = fixture.componentInstance;
    component.tunerLevel = 'building';

    enumService = fixture.debugElement.injector.get(EnumService);
    component.data = {
      tunerLevel: 'system',
      buildingsInfo: sgData,
      tuners: [
        { name: 'coolingDeadband', newVal: 2 },
        { name: 'coolingDeadbandMultiplier', newVal: 10 }
      ]

    };
    component.tuners = [
      { name: 'coolingDeadband', newVal: 2 },
      { name: 'coolingDeadbandMultiplier', newVal: 10 }
    ];
    dialog = fixture.debugElement.injector.get(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    tick(1);
    expect(component).toBeTruthy();
  }));
  it('walker: form a tree based on tuners & selected smartgroup info', fakeAsync(() => {
    const item1 = sgData[0]['children'][0];
    const item2 = sgData[0]['children'][1];
    component.walker(sgData);
    tick(2);
    expect(item1.children.length).toBe(2);
    expect(item2.children.length).toBe(0);
  }));

  it('onNoClick: onclick of cancel', () => {
    component.onNoClick();
    expect(dialog.close).toBeTruthy();
  });

  it('hasAppicable: find same tuner by tunerGroup, name and refId ', () => {
    const tuner = {
      name: 'tuner1',
      tunerGroup: 'vav',
      refId: 'ref1'
    };
    component.pointers = [
      {
        tunerName: 'tuner1',
        tunerGroup: 'vav',
        refId: 'ref1'
      }
    ];
    const res = component.hasAppicable(tuner);
    expect(res.tunerName).toBe('tuner1');
  });

  it('hasAppicable: find same tuner by tunerGroup, name and refId but pointers are empty', () => {
    const tuner = {
      name: 'tuner1',
      tunerGroup: 'vav',
      refId: 'ref1'
    };
    component.pointers = [
    ];
    const res = component.hasAppicable(tuner);
    expect(res).toBeUndefined();
  });

});
