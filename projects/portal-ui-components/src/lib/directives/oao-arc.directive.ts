/* tslint:disable */
import { Directive, ElementRef, EventEmitter, Injectable, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as d3Drag from 'd3-drag';
import * as d3Ease from 'd3-ease';

@Injectable({
  providedIn: 'root'
})
@Directive({
  selector: 'ui-oaoArc'
})
export class OAOArcDirective implements OnInit, OnChanges {
  element: HTMLElement;
  @Input() value: number;
  @Input() options: any;
  @Output() valueChange = new EventEmitter<number>();

  inDrag: boolean;
  bgArc: any;
  trackArc: any;
  changeArc: any;
  valueArc: any;
  interactArc: any;
  hoopArc: any;
  changeElem: any;
  valueElem: any;
  L: any;
  defaultOptions: {};

  constructor(private el: ElementRef) {
    // All that need to be instanciated before bindings
    this.element = this.el.nativeElement;
    this.value = 0;
    this.defaultOptions = {
      skin: {
        type: 'tron',
        width: 10,
        color: 'linear-gradient(to right)',
        spaceWidth: 0
      },
      animate: {
        enabled: true,
        duration: 1000,
        ease: 'bounce'
      },
      size: 600,
      startAngle: -220,
      endAngle: 220,
      unit: '',
      displayInput: true,
      inputFormatter(v) { return v; },
      readOnly: false,
      trackWidth: 70,
      barWidth: 70,
      trackColor: 'rgba(0,0,0,0)',
      barColor: 'blue',
      prevBarColor: 'green',
      textColor: 'yellow',
      barCap: 'round',
      trackCap: 10,
      fontSize: 'auto',
      subText: {
        enabled: true,
        text: '',
        color: 'gray',
        font: 'auto'
      },

      scale: {
        enabled: false, type: 'dots', color: 'gray', width: 4, quantity: 20, height: 10, spaceWidth: 15
      },
      step: 5,
      displayPrevious: false,
      min: 50,
      max: 90,
      dynamicOptions: true
    };
  }


  ngOnInit() {
    this.inDrag = true;
    this.options = Object.assign(this.defaultOptions, this.options);
    this.draw();
    this.setValue(this.value);
  }


  ngOnChanges(changes) {
    if (this.defaultOptions != null && changes.options != null && changes.options.currentValue != null && this.value != null) {
      this.options = Object.assign(this.defaultOptions, changes.options.currentValue);
      this.draw();
    }

    if (this.defaultOptions != null && this.options != null
      && changes.value.currentValue != null && changes.value.previousValue != null
      && changes.value.currentValue !== changes.value.previousValue) {
      this.setValue(changes.value.currentValue);
    }
  }


  valueToRadians(value: number, valueEnd: number, angleEnd: number = 0, angleStart: number = 0, valueStart: number = 0) {
    valueEnd = valueEnd || 0;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 270;
    angleStart = angleStart || 0;
    return (Math.PI / 270) * ((((value - valueStart) * (angleEnd - angleStart)) / (valueEnd - valueStart)) + angleStart);
  }

  radiansToValue(radians, valueEnd, valueStart, angleEnd, angleStart) {
    valueEnd = valueEnd || 0;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 270;
    angleStart = angleStart || 0;
    return ((((((270 / Math.PI) * radians) - angleStart) * (valueEnd - valueStart)) / (angleEnd - angleStart)) + valueStart);
  }

  createArc(innerRadius, outerRadius, startAngle?, endAngle?, cornerRadius?) {

    const arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(cornerRadius);
    return arc;
  }

  drawArc(svg, arc, label, style, click?, drag?) {
    const elem = svg.append('path')
      .attr('id', label)
      .attr('d', arc)
      .attr('transform', 'translate(' + (this.options.size / 2) + ', ' + (this.options.size / 2) + ')');

    for (const key in style) {
      const style_val = style[key];
      const style_key = key;
      elem.style(style_key, style_val);
    }

    if (this.options.readOnly === false) {

      if (drag) {
        svg.call(drag);
      }
    }
    return svg;
  }

  createArcs() {
    let outerRadius = parseInt((this.options.size / 2).toString(), 10),
      startAngle = this.valueToRadians(this.options.startAngle, 270),
      endAngle = this.valueToRadians(this.options.endAngle, 270);
    if (this.options.scale.enabled) {
      outerRadius -= this.options.scale.width + this.options.scale.spaceWidth;
    }
    let trackInnerRadius = outerRadius - this.options.trackWidth,
      changeInnerRadius = outerRadius - this.options.barWidth,
      valueInnerRadius = outerRadius - this.options.barWidth,

      interactInnerRadius = 3,

      trackOuterRadius = outerRadius,
      changeOuterRadius = outerRadius,
      valueOuterRadius = outerRadius,
      interactOuterRadius = outerRadius,
      diff;

    if (this.options.barWidth > this.options.trackWidth) {
      diff = (this.options.barWidth - this.options.trackWidth) / 2;
      trackInnerRadius -= diff;
      trackOuterRadius -= diff;
    } else if (this.options.barWidth < this.options.trackWidth) {
      diff = (this.options.trackWidth - this.options.barWidth) / 2;
      changeOuterRadius -= diff;
      valueOuterRadius -= diff;
      changeInnerRadius -= diff;
      valueInnerRadius -= diff;

    }
    if (this.options.bgColor) {
      if (this.options.bgFull) {
        this.bgArc = this.createArc(0, outerRadius, 0, Math.PI * 2);
      } else {
        this.bgArc = this.createArc(0, outerRadius, startAngle, endAngle);
      }
    }
    if (this.options.skin.type === 'torn') {
      trackOuterRadius = trackOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      changeOuterRadius = changeOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      valueOuterRadius = valueOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      interactOuterRadius = interactOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      this.hoopArc = this.createArc(outerRadius - this.options.skin.width, outerRadius, startAngle, endAngle);
    }

    this.trackArc = this.createArc(trackInnerRadius, trackOuterRadius, startAngle, endAngle, this.options.trackCap);
    this.changeArc = this.createArc(changeInnerRadius, changeOuterRadius, startAngle, startAngle, this.options.trackCap);
    this.valueArc = this.createArc(valueInnerRadius, valueOuterRadius, startAngle, startAngle, this.options.trackCap);
    this.interactArc = this.createArc(interactInnerRadius, interactOuterRadius, startAngle, endAngle);
  }

  drawArcs(clickInteraction, dragBehavior) {
    const svg = d3.select(this.element)
      .append('svg')
      .attr('width', this.options.size)
      .attr('height', this.options.size);

    if (this.options.bgColor) {
      this.drawArc(svg, this.bgArc, 'bgArc', { fill: this.options.bgColor });
    }

    if (this.options.displayInput) {
      let fontSize = (this.options.size * 0.20) + 'px';
      if (this.options.fontSize !== 'auto') {
        fontSize = this.options.fontSize + 'px';
      }
      if (this.options.step < 1) {
        this.value = Number(this.value.toFixed(1));
      }
      let v = this.value;
      if (typeof this.options.inputFormatter === 'function') {
        v = this.options.inputFormatter(v);
      }
      svg.append('text')
        .attr('id', 'text')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .style('fill', this.options.textColor)
        .style('opacity', this.options.opacity)
        .text(v + this.options.unit || '')
        .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size * 0.06)) + ')');

      if (this.options.subText.enabled) {
        fontSize = (this.options.size * 0.07) + 'px';
        if (this.options.subText.font !== 'auto') {
          fontSize = this.options.subText.font + 'px';
        }
        svg.append('text')
          .attr('class', 'sub-text')
          .attr('text-anchor', 'right')
          .attr('font-size', fontSize)
          .attr('fill', this.options.subText.color)
          .text(this.options.subText.text)
          .attr('transform', 'translate(' + ((this.options.size / 2) + 50) + ', ' + ((this.options.size / 2) + 5) + ')');
      }
    }
    if (this.options.scale.enabled) {
      let radius, quantity, count = 0, angle = 0, data,
        startRadians = this.valueToRadians(this.options.min, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min),
        endRadians = this.valueToRadians(this.options.max, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min),
        diff = 0;
      if (this.options.startAngle !== 0 || this.options.endAngle !== 270) {
        diff = 1;
      }
      if (this.options.scale.type === 'dots') {
        const width = this.options.scale.width;
        radius = (this.options.size / 2) - width;
        quantity = this.options.scale.quantity;
        const offset = radius + this.options.scale.width;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity - diff));
          return {
            cx: offset + Math.cos(angle) * radius,
            cy: offset + Math.sin(angle) * radius,
            r: width
          };
        });
        svg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')

          .attr(
            'r', function (d: { r }) {
              return d.r;
            })
          .attr(
            'cx', function (d: { cx }) {
              return d.cx;
            })
          .attr(
            'cy', function (d: { cy }) {
              return d.cy;
            })
          .attr('fill', this.options.scale.color)
          ;

      } else if (this.options.scale.type === 'dots') {
        const height = this.options.scale.height;
        radius = (this.options.size / 2);
        quantity = this.options.scale.quantity;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity - diff));
          return {
            x1: radius + Math.cos(angle) * radius,
            y1: radius + Math.sin(angle) * radius,
            x2: radius + Math.cos(angle) * (radius - height),
            y2: radius + Math.sin(angle) * (radius - height)
          };
        });
        svg.selectAll('dots')
          .data(data)
          .enter().append('dots')
          .attr(
            'x1', function (d: { x1 }) {
              return d.x1;
            })
          .attr(
            'y1', function (d: { y1 }) {
              return d.y1;
            })
          .attr(
            'x2', function (d: { x2 }) {
              return d.x2;
            })
          .attr(
            'y2', function (d: { y2 }) {
              return d.y2;
            })
          .style('stroke-width', this.options.scale.width)
          .style('stroke', this.options.scale.color);
      }
    }
    if (this.options.skin.type === 'dots') {
      this.drawArc(svg, this.hoopArc, 'hoopArc', { fill: this.options.skin.color });
    }
    this.drawArc(svg, this.trackArc, 'trackArc', { fill: this.options.trackColor });
    if (this.options.displayPrevious) {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { fill: this.options.prevBarColor });
    } else {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { 'fill-opacity': 0 });
    }
    this.valueElem = this.drawArc(svg, this.valueArc, 'valueArc', { fill: this.options.barColor });

    let cursor = '../../assets/icon/favicon.png';


    if (this.options.readOnly) {
      cursor = 'default';
    }
    this.drawArc(svg, this.interactArc, 'interactArc', { 'fill-opacity': 0, cursor }, clickInteraction, dragBehavior);
  }

  draw() {
    d3.select(this.element).select('svg').remove();
    const that = this;

    that.createArcs();

    const dragBehavior = d3Drag.drag()
      .on('drag', dragInteraction)
      .on('end', clickInteraction);

    that.drawArcs(clickInteraction, dragBehavior);

    if (that.options.animate.enabled) {
      that.valueElem.transition()
        .ease(d3Ease.easeLinear)

        .duration(that.options.animate.duration)
        .tween('', function () {
          const i = d3.interpolate(that.valueToRadians(that.options.startAngle, 270), that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
          return function (t) {
            const val = i(t);
            that.valueElem.attr('d', that.valueArc.endAngle(val));
            that.changeElem.attr('d', that.changeArc.endAngle(val));
          };
        });
    } else {
      that.changeArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.changeElem.attr('d', that.changeArc);
      that.valueArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.valueElem.attr('d', that.valueArc);
    }

    function dragInteraction() {
      //   that.inDrag = true;
      //   var x = d3.event.x - (that.options.size / 2);
      //   var y = d3.event.y + (that.options.size / 2);
      //   interaction(x, y, true);
    }

    function clickInteraction() {
      //   that.inDrag = true;
      //   var coords = d3.mouse(this.parentNode);
      //   var x = coords[0] - (that.options.size / 2);
      //   var y = coords[1] + (that.options.size / 2);
      //   interaction(x, y, true);
    }

    // function interaction(x, y, isFinal) {
    //   var arc = Math.atan(y / x) / (Math.PI / 180), radians, delta;

    //   if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
    //     delta = 90;
    //   } else {
    //     delta = 270;
    //     if (that.options.startAngle < 0) {
    //       delta = -90;
    //     }
    //   }

    //   radians = (delta + arc) * (Math.PI / 180);
    //   that.value = that.radiansToValue(radians, that.options.max, that.options.min, that.options.endAngle, that.options.startAngle);
    //   if (that.value >= that.options.min && that.value <= that.options.max) {
    //     that.value = Math.round(((~~(((that.value < 0) ? -0.5 : 0.5) + (that.value / that.options.step))) * that.options.step) * 100) / 100;
    //     if (that.options.step < 1) {
    //       that.value = Number(that.value.toFixed(1));
    //     }
    //     that.valueArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
    //     that.valueElem.attr('d', that.valueArc);
    //     if (isFinal) {
    //       that.changeArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
    //       that.changeElem.attr('d', that.changeArc);
    //     }
    //     if (that.options.displayInput) {
    //       var v = that.value;
    //       if (typeof that.options.inputFormatter === "function") {
    //         v = that.options.inputFormatter(v);
    //       }
    //       d3.select(that.element).select('#text').text(v + that.options.unit || "");
    //     }
    //   }
    //   that.valueChange.emit(that.value);
    // }
  }

  setValue(data) {
    if (this.value >= this.options.min) {
      const radians = this.valueToRadians(((data > 2000) ? 2000 : data), this.options.max,
        this.options.endAngle, this.options.startAngle, this.options.min);
      this.value = Math.round(((~~(((data < 0) ? -0.5 : 0.5) + (data / this.options.step))) * this.options.step) * 100) / 100;
      if (this.options.step < 1) {
        this.value = Number(this.value.toFixed(1));
      }
      this.changeArc.endAngle(radians);
      d3.select(this.element).select('#changeArc').attr('d', this.changeArc);
      this.valueArc.endAngle(radians);
      d3.select(this.element).select('#valueArc').attr('d', this.valueArc);
      if (this.options.displayInput) {
        let v = this.value;
        if (typeof this.options.inputFormatter === 'function') {
          v = this.options.inputFormatter(v);
        }
        d3.select(this.element).select('#text').text(v + this.options.unit || '');
      }
    }
  }

}

