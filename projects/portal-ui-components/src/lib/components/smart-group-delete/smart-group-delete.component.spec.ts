import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartGroupDeleteComponent } from './smart-group-delete.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
describe('SmartGroupDeleteComponent', () => {
    let component: SmartGroupDeleteComponent;
    let fixture: ComponentFixture<SmartGroupDeleteComponent>;
    let overlayContainerElement: HTMLElement;
    let dialog: MatDialogRef<any>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [SmartGroupDeleteComponent],
            providers: [
                {
                    provide: OverlayContainer, useFactory: () => {
                        overlayContainerElement = document.createElement('div');
                        return { getContainerElement: () => overlayContainerElement };
                    }
                },
                { provide: MatDialogRef, useValue: { close() { return true } } },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SmartGroupDeleteComponent);
        component = fixture.componentInstance;
        dialog = fixture.debugElement.injector.get(MatDialogRef);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('onclick of cancel', () => {
        component.onNoClick();
        expect(dialog.close).toBeTruthy();
    })
});
