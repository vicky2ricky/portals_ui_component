import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    SimpleChange,
} from '@angular/core';
import { HeatMapToolTipService } from '../../services/heatmap-tooltip.service';

@Component({
    selector: 'puc-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnChanges {
    @Input() blockTitle: string;
    @Input() isOpen: boolean;
    @Input() titleStyle?: any;
    @Input() graphId: string;
    @Input() isActive: boolean = false;
    @Input() showActive: boolean = false

    constructor(
        private heatmapToolTipService: HeatMapToolTipService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        const isOpen: SimpleChange = changes.isOpen;
        const isActive :SimpleChange = changes.isActive
        if(isOpen) {
            this.isOpen = (isOpen && isOpen.currentValue) ? isOpen.currentValue : false
        }
        if(isActive) {
            this.isActive = (isActive && isActive.currentValue) ? isActive.currentValue : false;
        }
        
    }

    activateDropdown() {
        this.blockTitle.includes('Default System Profile') ? this.isOpen = false : this.isOpen = !this.isOpen;
        if (this.isOpen) {
            // Pop it from closed accordian list
            if (this.heatmapToolTipService.graphAccordianDataVisibility.length) {
                this.heatmapToolTipService.graphAccordianDataVisibility
                .splice(this.heatmapToolTipService.graphAccordianDataVisibility.indexOf(this.graphId), 1);
            }
        } else {
            // Push it to closed accordian list
            this.heatmapToolTipService.graphAccordianDataVisibility
            /* tslint:disable-next-line */
            .indexOf(this.graphId) === -1 ? this.heatmapToolTipService.graphAccordianDataVisibility.push(this.graphId) : '';
        }
    }
}
