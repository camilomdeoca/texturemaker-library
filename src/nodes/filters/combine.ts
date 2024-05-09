import { Vector2 } from "vectors-typescript";
import { IFilterNode } from "../filternode.js";
import { Color } from "../../color.js";
import { INode } from "../node.js";

export class CombineNode implements IFilterNode {
  public getValueAt(position: Vector2): Color {
    const factor = this.factor;
    const col0 = this.inputs.first.getValueAt(position);
    const col1 = this.inputs.second.getValueAt(position);
    const r = col0.r * (1 - factor) + col1.r * factor;
    const g = col0.g * (1 - factor) + col1.g * factor;
    const b = col0.b * (1 - factor) + col1.b * factor;
    return new Color(r, g, b, 1);
  }

  public inputs: { first: INode, second: INode } = { first: undefined, second: undefined };
  public factor: number = 0.5;
}
