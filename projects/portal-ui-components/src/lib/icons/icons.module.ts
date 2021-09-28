import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GasIconComponent } from './gas-icon.component';
import { ElectricityIconComponent } from './electricty-icon.component';
import { DollarIconComponent } from './dollar-icon.component';



@NgModule({
    declarations: [GasIconComponent, ElectricityIconComponent, DollarIconComponent],
    imports: [
        CommonModule
    ],
    exports: [GasIconComponent, ElectricityIconComponent, DollarIconComponent]
})
export class IconsModule { }
