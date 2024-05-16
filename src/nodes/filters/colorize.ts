import { Vector2 } from "vectors-typescript";
import { Color, HslColor } from "../../color.js";
import { IFilterNode } from "../filternode.js";
import { INode } from "../node.js";

export interface ColorizeControlPoint {
  lightness: number; // from 0 to 1
  color: Color;
};

export class ColorizeNode implements IFilterNode {
  constructor() { }

  getValueAt(position: Vector2): Color {
    const colorIn = this.input.getValueAt(position);
    const lightness = colorIn.toHsl().l;

    let indexLow = 0;
    let indexHigh = this.colors.length - 1;

    // If the first and last control point are not at 0 and 1 and a lightness value goes before the
    // first control point or after the last, then the color gets clamped to the closest control
    // point.
    if (this.colors[indexLow].lightness > lightness)
      return this.colors[indexLow].color;
    if (this.colors[indexHigh].lightness < lightness)
      return this.colors[indexHigh].color;

    // Binary search for the control points closest to the input lightness value
    while (indexHigh - indexLow > 1) {
      const index = Math.floor((indexHigh + indexLow) / 2);
      if (this.colors[index].lightness > lightness) indexHigh = index;
      else if (this.colors[index].lightness < lightness) indexLow = index;
      else return this.colors[index].color; // In the case it is exactly at a control point
    }

    // Interpolate between the colors of the control points
    const lightnessLow = this.colors[indexLow].lightness;
    const lightnessHigh = this.colors[indexHigh].lightness;
    const factor = (lightness - lightnessLow) / (lightnessHigh - lightnessLow);
    return Color.lerp(
      this.colors[indexLow].color,
      this.colors[indexHigh].color,
      factor
    );
  }

  // TODO: Ensure array is ordered
  public colors: ColorizeControlPoint[] = [
    {
      lightness: 0,
      color: new Color(0),
    },
    {
      lightness: 1,
      color: new Color(1),
    },
  ];
  public input: INode = undefined;
}
