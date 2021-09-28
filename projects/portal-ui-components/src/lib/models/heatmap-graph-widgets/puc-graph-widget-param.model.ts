/**
 * @description For structuring of graph parameters in heatmap and adhoc tool
 */
import { PucToolTipModel } from './puc-tool-tip.model';
import { PucGraphTypes } from './puc-graph-types.model';

export class PucGraphWidgetParam {
    name: string;
    color: string;
    toolTip: PucToolTipModel;
    type: PucGraphTypes;
    stackOrder: number; // always use descending order
    writableOnly: boolean;

    constructor(name: string, color: string, type: PucGraphTypes, tooltip: PucToolTipModel, stackOrder?: number, writableOnly?: boolean) {
        this.name = name;
        this.color = color;
        this.type = type;
        this.toolTip = tooltip;
        this.stackOrder = stackOrder;
        this.writableOnly = writableOnly;
    }
}
