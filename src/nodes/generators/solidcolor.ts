import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IGeneratorNode } from "../generatornode.js";
import { INode } from "../node.js";

export class SolidColorNode implements IGeneratorNode {
  public getValueAt(_position: Vector2): Color {
    return this.color;
  }
  get inputs(): Map<string, INode | undefined> {
    return new Map();
  }

  public color: Color = new Color(1.0, 1.0, 1.0, 1.0);
}
