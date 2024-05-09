import { Vector2 } from "vectors-typescript";
import { Color } from "../color.js";

export interface INode {
  getValueAt(position: Vector2): Color;
}
