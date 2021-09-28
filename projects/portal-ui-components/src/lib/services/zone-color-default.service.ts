import { BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ZoneDefaultFilter {
    private _data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private unsubscribe: Subject<void> = new Subject();
    temperatureColors = [
        {
            color: '#304369',
            zoneNameColor: '#ffffff',
            currentTempColor: '#ffffff',
            partitionColor: '#ffffff',
            heatingDesiredColor: '#fcaf17',
            coolingDesiredColor: '#d9e7f4',
            temp: -6
        },
        {
            color: '#92bed4',
            zoneNameColor: '#ffffff',
            currentTempColor: '#ffffff',
            partitionColor: '#ffffff',
            heatingDesiredColor: '#b02c25',
            coolingDesiredColor: '#304369',
            temp: -4
        },
        {
            color: '#d9e7f4',
            zoneNameColor: '#4f4f4f',
            currentTempColor: '#4f4f4f',
            partitionColor: '#4f4f4f',
            heatingDesiredColor: '#b02c25',
            coolingDesiredColor: '#304369',
            temp: -2
        },
        {
            color: '#d0e39d',
            zoneNameColor: '#4f4f4f',
            currentTempColor: '#4f4f4f',
            partitionColor: '#4f4f4f',
            heatingDesiredColor: '#b02c25',
            coolingDesiredColor: '#304369',
            temp: 0
        },
        {
            color: '#fcaf17',
            zoneNameColor: '#ffffff',
            currentTempColor: '#ffffff',
            partitionColor: '#ffffff',
            heatingDesiredColor: '#b02c25',
            coolingDesiredColor: '#304369',
            temp: 2
        },
        {
            color: '#f6892e',
            zoneNameColor: '#ffffff',
            currentTempColor: '#ffffff',
            partitionColor: '#ffffff',
            heatingDesiredColor: '#b02c25',
            coolingDesiredColor: '#d9e7f4',
            temp: 4
        },
        {
            color: '#b02c25',
            zoneNameColor: '#ffffff',
            currentTempColor: '#ffffff',
            partitionColor: '#ffffff',
            heatingDesiredColor: '#fcaf17',
            coolingDesiredColor: '#d9e7f4',
            temp: 6
        }
    ];

    hex2rgba = (hex, alpha = 1) => {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    };

    setPerZoneTemperatureRanges(heatingdeadband, coolingdeadband) {
        const tempcolors = this.temperatureColors;

        tempcolors[0].temp = -3 * (heatingdeadband);
        tempcolors[1].temp = -2 * (heatingdeadband);
        tempcolors[2].temp = -1 * (heatingdeadband);

        tempcolors[4].temp = 1 * (coolingdeadband);
        tempcolors[5].temp = 2 * (coolingdeadband);
        tempcolors[6].temp = 3 * (coolingdeadband);

        return tempcolors;
    }

    defaultFilter(objTemp) {
        objTemp.temperatureColors = this.setPerZoneTemperatureRanges(objTemp.heatingdeadband, objTemp.coolingdeadband);
        objTemp.minRange = objTemp.desiredTempHeating - objTemp.heatingdeadband;
        objTemp.maxRange = objTemp.desiredTempCooling + objTemp.coolingdeadband;
        if (objTemp.currentTemp < objTemp.minRange) {
            objTemp.tempColorToInsert = this.getColor(objTemp, 'heating');
        }
        if ((objTemp.currentTemp >= objTemp.minRange) && (objTemp.currentTemp <= objTemp.maxRange)) {
            const colorObj = objTemp.temperatureColors.find(color => color.temp === 0);
            objTemp.zoneNameLabelColor = colorObj.zoneNameColor;
            objTemp.currentTempLabelColor = colorObj.currentTempColor;
            objTemp.partitionColor = colorObj.partitionColor;
            objTemp.heatingDesiredLabelColor = colorObj.heatingDesiredColor;
            objTemp.coolingDesiredLabelColor = colorObj.coolingDesiredColor;
            objTemp.tempColorToInsert = colorObj.color;

        } else if (objTemp.currentTemp > objTemp.maxRange) {
            objTemp.tempColorToInsert = this.getColor(objTemp, 'cooling');
        }

        if ((Number(objTemp.zoneOccupancy) == 0) || (Number(objTemp.zoneOccupancy) == 4)) {
            const zoneColorHex = objTemp.tempColorToInsert;
            const zoneColorHexWithOpacity = this.hex2rgba(zoneColorHex, 0.6);
            objTemp.tempColorToInsert = zoneColorHexWithOpacity;
            objTemp.strokeColor = 'rgba(147,152,149,0.6)';
            // objTemp.hashedBackground = 'repeating-linear-gradient(-45deg,' + zoneColorHexWithOpacity + ',' + zoneColorHexWithOpacity + ' 4px,rgba(147,152,149,0.6) 4px,
            // rgba(147,152,149,0.6) 8px)';
        }
        return objTemp;
    }

    getColor(objTemp: any, tempMode: string) {
        const desiredTemp = tempMode == 'heating' ? objTemp.desiredTempHeating : objTemp.desiredTempCooling;
        const diff = objTemp.currentTemp - desiredTemp;
        const colorArr = objTemp.temperatureColors;
        const last = colorArr.length - 1;

        if (diff < colorArr[0].temp) {
            objTemp.zoneNameLabelColor = colorArr[0].zoneNameColor;
            objTemp.currentTempLabelColor = colorArr[0].currentTempColor;
            objTemp.partitionColor = colorArr[0].partitionColor;
            objTemp.heatingDesiredLabelColor = colorArr[0].heatingDesiredColor;
            objTemp.coolingDesiredLabelColor = colorArr[0].coolingDesiredColor;
            return colorArr[0].color;

        } else if (diff > colorArr[last].temp) {
            objTemp.zoneNameLabelColor = colorArr[last].zoneNameColor;
            objTemp.currentTempLabelColor = colorArr[last].currentTempColor;
            objTemp.partitionColor = colorArr[last].partitionColor;
            objTemp.heatingDesiredLabelColor = colorArr[last].heatingDesiredColor;
            objTemp.coolingDesiredLabelColor = colorArr[last].coolingDesiredColor;
            return colorArr[last].color;

        } else {
            const diffRanges = [...colorArr.map(x => x.temp)];
            let applyColorScaleValue;

            if (diff < 0) {
                applyColorScaleValue = Math.min(...diffRanges.filter(x => x > diff));
            } else if (diff > 0) {
                applyColorScaleValue = Math.max(...diffRanges.filter(x => x < diff));
            }

            const diffColorObj = colorArr.find(color => applyColorScaleValue === color.temp);
            objTemp.zoneNameLabelColor = diffColorObj.zoneNameColor;
            objTemp.currentTempLabelColor = diffColorObj.currentTempColor;
            objTemp.partitionColor = diffColorObj.partitionColor;
            objTemp.heatingDesiredLabelColor = diffColorObj.heatingDesiredColor;
            objTemp.coolingDesiredLabelColor = diffColorObj.coolingDesiredColor;
            return diffColorObj.color;
        }
    }
}