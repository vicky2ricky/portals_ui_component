import { SafeResourceUrl } from '@angular/platform-browser';
import { Shape } from './Shape';
import { Url } from 'url';

export class Floor {
    floorId: string;
    name: string;
    floorMapImage: string;
    url: string | ArrayBuffer | SafeResourceUrl;
    floorPlanImage: any;
    hasPlan: boolean;
    thumbnail: string;
    index: number;
    zoneCount: number;

    canvasUrl: string;

    shapes: Array<any>;
    enclosingDimensions: any;
    floorDimensions: any;
}
