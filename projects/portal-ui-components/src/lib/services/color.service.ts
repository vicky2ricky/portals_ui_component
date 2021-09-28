import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  private interpolateColor(color1, color2, amount) {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + amount * (color2[i] - color1[i]));
    }
    return result;
  }

  // Check Functions
  private checkHex(hex) {
    const hexRegex = /^[#]*([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i
    if (hexRegex.test(hex)) {
      return true;
    }
  }

  // This takes colors in the format rgb(.., .. ,..) - which is a string
  generateInterpolatedColors(color1: string, color2: string, steps) {
    const stepFactor = (steps > 1) ? (1 / (steps - 1)) : 1;
    const interpolatedColorArray = [];
    if (this.checkHex(color1)) {
      color1 = this.hexTorgb(color1)
    }
    if (this.checkHex(color2)) {
      color2 = this.hexTorgb(color2)
    }
    const color1Array = color1.match(/\d+/g).map(Number);
    const color2Array = color2.match(/\d+/g).map(Number);
    for (let i = 0; i < steps; i++) {
      const interpolatedColor = this.interpolateColor(color1Array, color2Array, stepFactor * i);
      const rgbaConversion = `rgba(${interpolatedColor[0]},${interpolatedColor[1]},${interpolatedColor[2]},${interpolatedColor[3]})`;
      interpolatedColorArray.push(rgbaConversion);
    }
    return interpolatedColorArray;
  }

  hexTorgb(hex) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},1)`;
  }

  // lowest opacity - the lightest color in the sequence.
  // totalColors - is the total number of colors that needs to be returned - which would include the base color & the lightest color.
  generateOpacityArray(baseColor, lowestOpacity, totalColors) {
    const opacityColorArray = [];
    const stepFactor = (totalColors > 1) ? ((1 - lowestOpacity) / (totalColors - 1)) : ((1 - lowestOpacity) / 1);
    if (this.checkHex(baseColor)) {
      baseColor = this.hexTorgb(baseColor)
    }
    const baseColorArray = baseColor.match(/\d+/g).map(Number);
    // Adding the base color
    // opacityColorArray.push(`rgba(${baseColorArray[0]}, ${baseColorArray[1]}, ${baseColorArray[2]}, 1`);
    for (let i = totalColors - 1; i >= 0; i--) {
      opacityColorArray.push(`rgba(${baseColorArray[0]}, ${baseColorArray[1]}, ${baseColorArray[2]}, ${lowestOpacity + i * stepFactor})`);
    }
    return opacityColorArray;
  }

  // Takes a base color and lightens up by a certain amount multiplied by the index
  lightenColor(baseColor, amount, index): string {
    return '#' + baseColor.replace(/^#/, '').replace(/../g, colorComp =>
      ('0' + Math.min(255, Math.max(0, parseInt(colorComp, 16) + (index * amount))).toString(16)).substr(-2));
  }

  // Takes a base color in rbg format, and darken it by a certain amount
  darkenColor(baseColor, amount) {
    if (this.checkHex(baseColor)) {
      baseColor = this.hexTorgb(baseColor)
    }
    const fullColorHex = this.fullColorHex(baseColor);
    // console.log(fullColorHex);
    const darkenedColor = '#' + fullColorHex.replace(/^#/, '').replace(/../g, colorComp =>
      ('0' + Math.min(255, Math.max(0, parseInt(colorComp, 16) + amount)).toString(16)).substr(-2));
    // console.log(darkenedColor);
    return darkenedColor;
  }


  fullColorHex(baseColor) {
    const baseColorArray = baseColor.match(/\d+/g).map(Number);
    return '#' +
      this.rgbToHex(baseColorArray[0]) + this.rgbToHex(baseColorArray[1]) + this.rgbToHex(baseColorArray[2]);
  }

  rgbToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }
}
