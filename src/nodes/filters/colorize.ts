import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IFilterNode } from "../filternode.js";
import { INode } from "../node.js";

export interface ColorizeControlPoint {
  lightness: number; // from 0 to 1
  color: Color;
};

export class ColorizeNode implements IFilterNode {
  public getValueAt(position: Vector2): Color {
    const colorIn = this.inputs.get("input").getValueAt(position);
    const lightness = colorIn.toHsl().l;
    return this.getColorMappedToLightness(lightness);
  }

  public getColorMappedToLightness(lightness: number): Color {
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
      factor**2
    );
  }

  // TODO: Ensure array is ordered
  public colors: ColorizeControlPoint[] = [
    {
      lightness: 0,
      color: new Color(0, 0, 0, 1),
    },
    {
      lightness: 1,
      color: new Color(1, 1, 1, 1),
    },
  ];
  public readonly inputs: Map<string, INode | undefined> = new Map([
    ["input", undefined],
  ]);
}
