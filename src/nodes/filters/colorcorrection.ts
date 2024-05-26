import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IFilterNode } from "../filternode.js";
import { INode } from "../node.js";

export class ColorCorrectionNode implements IFilterNode {
  public getValueAt(position: Vector2): Color {
    const inColor = this.inputs.get("input").getValueAt(position);
    let rgb = new Color(
      (inColor.r * 2 - 1) * this.contrast * 0.5 + 0.5,
      (inColor.g * 2 - 1) * this.contrast * 0.5 + 0.5,
      (inColor.b * 2 - 1) * this.contrast * 0.5 + 0.5,
      inColor.a
    );

    const hls = rgb.toHsl();
    hls.s *= this.saturation;
    hls.l *= this.brightness;
    rgb = hls.toRgb();
    rgb.r **= this._invGamma;
    rgb.g **= this._invGamma;
    rgb.b **= this._invGamma;
    return rgb;
  }

  public set gamma(gamma: number) {
    this._invGamma = 1 / gamma;
  }

  public get gamma(): number {
    return 1 / this._invGamma;
  }

  public contrast: number = 1.0;
  public saturation: number = 1.0;
  public brightness: number = 1.0;
  public readonly inputs: Map<string, INode | undefined> = new Map([
    ["input", undefined],
  ]);

  private _invGamma: number = 1.0;
}
