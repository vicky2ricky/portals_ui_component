/**
 * @description to give strucure to graph widgets model
 */

import { PucGraphWidgetParam } from './puc-graph-widget-param.model';
import { PucGraphWidgetHeight } from './puc-graph-widget-height.enum';

/**
 * @description holds strcuture of heatmap graph widget
 */
export class PucGraphWidgetModel {
    name: string;
    id: string;
    type: string;
    params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
    names: Array<string>;
    group: string;
    widgetHeight: number;

    constructor(name: string, id: string, type: string, params: Array<PucGraphWidgetParam>,
                names?: Array<string>, group?: string, widgetHeight: number = PucGraphWidgetHeight.REGULAR) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.params = params;
        this.widgetHeight = widgetHeight;

        if (names) {
            this.names = names;
        }

        if (group) {
            this.group = group;
        }
    }
}
