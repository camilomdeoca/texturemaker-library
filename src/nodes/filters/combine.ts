import { Vector2 } from "vectors-typescript";
import { IFilterNode } from "../filternode.js";
import { Color, HslColor } from "../../color.js";
import { INode } from "../node.js";

type BlendingMode = "rgb" | "hsl";

export class CombineNode implements IFilterNode {
  public getValueAt(position: Vector2): Color {
    const factor = this.factor;
    const col0 = this.inputs.get("first").getValueAt(position);
    const col1 = this.inputs.get("second").getValueAt(position);
    if (this.blendingMode === "rgb")
      return this.blendRgb(col0, col1, factor);
    else if (this.blendingMode === "hsl")
      return this.blendHsl(col0, col1, factor);
  }

  private blendRgb(col0: Color, col1: Color, factor: number): Color {
    const r = col0.r * (1 - factor) + col1.r * factor;
    const g = col0.g * (1 - factor) + col1.g * factor;
    const b = col0.b * (1 - factor) + col1.b * factor;
    return new Color(r, g, b, 1);
  }

  private blendHsl(col0: Color, col1: Color, factor: number): Color {
    const hsl0 = col0.toHsl();
    const hsl1 = col1.toHsl();
    const h = hsl0.h * (1 - factor) + hsl1.h * factor;
    const s = hsl0.s * (1 - factor) + hsl1.s * factor;
    const l = hsl0.l * (1 - factor) + hsl1.l * factor;
    return new HslColor(h, s, l, 1).toRgb();
  }

  public blendingMode: BlendingMode = "hsl";
  public readonly inputs: Map<string, INode> = new Map([
    ["first", undefined],
    ["second", undefined],
  ]);
  public factor: number = 0.5;
}
