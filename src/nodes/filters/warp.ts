import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IFilterNode } from "../filternode.js";
import { INode } from "../node.js";

const WARP_STEP: number = 0.001;

export class WarpNode implements IFilterNode {
  public getValueAt(position: Vector2): Color {
    let lightness = this.inputs.warper.getValueAt(position).toHsl().l;
    let lightnessX = this.inputs.warper.getValueAt(Vector2.add(position, new Vector2(WARP_STEP, 0))).toHsl().l;
    let lightnessY = this.inputs.warper.getValueAt(Vector2.add(position, new Vector2(0, WARP_STEP))).toHsl().l;
    let dx = (lightness - lightnessX) / WARP_STEP;
    let dy = (lightness - lightnessY) / WARP_STEP;

    return this.inputs.warped.getValueAt(Vector2.add(position, new Vector2(dx, dy).times(this.strength * (1 / 1000))));
  }

  public inputs: { warper: INode, warped: INode } = { warper: undefined, warped: undefined };
  public strength: number = 1;
}
