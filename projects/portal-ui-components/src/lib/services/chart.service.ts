// import * as d3 from 'd3';
declare const d3v5: any;

import { Injectable } from '@angular/core';
import { round } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  dispatch: any = d3v5.dispatch('mymousemove', 'mymouseover', 'mymouseleave');
  constructor() { }

  /**
   * The d3v5.scaleBand() function in d3v5.js is used to construct a new band scale with
   * the domain specified as an array of values and
   * the range as the minimum and maximum extents of the bands.
   * This function splits the range into n bands where n is the number of values in the domain array.
   */
  createScaleBand(input: number | Array<string>, startRange, endRange, padding?) {
    let domain: Array<string>;

    if (typeof input === 'number') {
      domain = d3v5.range(input).map(String);
    } else {
      domain = input;
    }
    const scaleBand = d3v5.scaleBand()
      .domain(domain)
      .range([startRange, endRange]);

    if (padding) {
      scaleBand.padding(padding);
    }
    return scaleBand;
  }


  createScaleLinear(startDomainValue, endDomainValue, startRange, endRange) {
    return d3v5.scaleLinear()
      .domain([startDomainValue, endDomainValue]).nice()
      .rangeRound([startRange, endRange]).nice();
  }


  // Since the original one is causing scaling issues with Box Whisker
  createScaleLinearNotNice(startDomainValue, endDomainValue, startRange, endRange) {
    return d3v5.scaleLinear()
      .domain([startDomainValue, endDomainValue])
      .rangeRound([startRange, endRange]);
  }

  getSmartTicks(val) {
    // base step between nearby two ticks
    let valLength;
    if (val > 1) {
      valLength = val.toString().length;
    } else {
      valLength = 1;
    }
    let step = Math.pow(10, valLength - 1);

    // modify steps either: 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000...
    if (val <= .1) {
      step = .1;
    } else if (val / step < 2) {
      step = step / 5;
    } else if (val / step < 5) {
      step = step / 2;
    }

    // add one more step if the last tick value is the same as the max value
    // if you don't want to add, remove "+1"
    const slicesCount = Math.ceil((val) / step);

    return {
      endPoint: slicesCount * step,
      count: Math.min(10, slicesCount) // show max 10 ticks
    };

  }


  addDays(dateObj, numDays) {
    dateObj.setDate(dateObj.getDate() + numDays);
    return dateObj;
 }


  generateXLabel(grpBy, data, index) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = data && data.date ? new Date(data?.date) : null;

    let label = '';
    grpBy = grpBy.toLowerCase();

    if (grpBy === 'hourly' && date) {
      let hour_string = String(date.getHours());
      while (hour_string.length < 2) {
        hour_string = '0' + hour_string;
      }

      hour_string = hour_string + ':00';
      label = date ? `${months[date.getMonth()]} ${date.getDate()}, ${hour_string}` : '';

    } else if (grpBy === 'daily' && date) {
      label = date ? `${months[date.getMonth()]} ${date.getDate()}` : '';

    } else if (grpBy === 'weekly' && date) {
      const startDate = date;
      const endDate = this.addDays(new Date(startDate.getTime()), 7);

      if (startDate.getMonth() !== endDate.getMonth()) {
        label = date ?  `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}` : '';
      } else {
        label = date ? `${months[startDate.getMonth()]} ${startDate.getDate()} - ${endDate.getDate()}` : '';
      }

    } else if (grpBy === 'monthly' && date) {
      label = `${months[date.getMonth()]}, ${date.getFullYear()}`;

    }

    return label;
  }


  getXValDate(groupBy, d) {
    let xValDate = '';
    const date = d.date ? new Date(d.date) : null;

    groupBy = groupBy.toLowerCase();

    if (groupBy === 'hourly' && date) {
      xValDate = date.toDateString() + ' ' +
        date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
    } else  if (groupBy === 'monthly' && date) {
      const splitDate = date.toDateString().split(' ');
      xValDate = [splitDate[1], splitDate[3]].join(', ');
    } else if(date){
      xValDate = date.toDateString();
    }

    return xValDate;
  }


  addXTicks(className, groupBy, bandwidth, rows, rotation = -45, chartType?) {
    const ticks = d3v5.selectAll(`${className}`);

    groupBy = groupBy.toLowerCase();
    const isHourly = groupBy === 'hourly';
    // const bandWidth = bandwidth;
    const ticksCount = rows;

    const maxTicks = 12;
    const modFactor = Math.ceil(ticksCount / maxTicks);

    ticks.each(function (_, i) {
      // console.log(i, i !== 0 && (i + 1) % 5 !== 0 && ticksCount > 4);
      // if (i !== 0 && i !== ticksCount && (i + 1) % 5 !== 0 && ticksCount > 14) {
      if (i !== 0 && i + 1 !== ticksCount && (i + 1) % modFactor !== 0 && ticksCount > maxTicks) {
        d3v5.select(this).remove();
      } else {
        const currentTransform = d3v5.select(this).attr('transform');
        d3v5.select(this).attr('transform', `${currentTransform} rotate(${isHourly ? rotation : 0})`);

        const hourlyXOffset = chartType === 'heatmap' ? -8 : (chartType === 'peu' ? -4 : -20);
        const hourlyYOffset = chartType === 'peu' ? 0 : 5;
        const notHourlyYOffset = chartType === 'heatmap' ? 0 : 5;

        if (chartType && chartType === 'bch') {
          d3v5.select(this).select('text')
            .attr('transform', `translate( 11, -2)`)
            .attr('text-anchor', 'end');
        } else {
          d3v5.select(this).select('text')
            // .attr('transform', `translate( -${bandwidth / 2}, 5)`)
            .attr('transform', isHourly? `translate( ${hourlyXOffset}, ${hourlyYOffset})` : `translate( 0, ${notHourlyYOffset})`)
            .attr('text-anchor', isHourly ? (chartType === 'heatmap' ? 'middle' : 'end') : 'middle');
        }
      }

      // Removing the one tick before the last tick
      if (ticksCount - (i + 1) === 1) {
        if (ticksCount > maxTicks) {
          d3v5.select(this).remove();
        } else {
          if (!(chartType === 'heatmap' || chartType === 'peu' || chartType === 'bcv')) {
            d3v5.select(this).remove();
          }
        }
      }
    });
  }


  modifyMaxValueY(maxValue, minValue = 0) {
    if (maxValue > 1) {
      if (maxValue < 10) {
        maxValue = Math.ceil(maxValue);
      } else {
        maxValue = Math.ceil(maxValue / 10) * 10;
      }
    } else {
      // maxValue = Math.ceil((maxValue + Number.EPSILON) * 10) / 10
      maxValue = maxValue * 10;
      if (maxValue < 1) {
        maxValue = maxValue < .5 ? .5 : Math.ceil(maxValue); // Just changing the value a bit.
      }
      maxValue = maxValue / 10;
    }
    return [minValue || 0, maxValue];
  }


  createRandomClassName(startClass) {
    const randomPrefix = [];
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    for ( let i = 0; i < 7; i++) {
      const random = Math.floor(Math.random() * letters.length);
      randomPrefix.push(letters[random]);
    }
    const random = randomPrefix.join('');
    return `${startClass}_${random}`;
  }

}
