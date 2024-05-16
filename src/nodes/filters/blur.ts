import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IFilterNode } from "../filternode.js";
import { INode } from "../node.js";

const BLUR_STEP: number = 0.005;

export class BlurNode implements IFilterNode {
  getValueAt(position: Vector2): Color {
    let sum = {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };
    let pointsCount = 0;
    for (let y = -this.radius * BLUR_STEP; y <= this.radius * BLUR_STEP; y += BLUR_STEP) {
      for (let x = -this.radius * BLUR_STEP; x <= this.radius * BLUR_STEP; x += BLUR_STEP) {
        if (x ** 2 + y ** 2 <= this.radius ** 2) {
          const color = this.input.getValueAt(Vector2.add(position, new Vector2(x, y)));
          sum.r += color.r ** 2;
          sum.g += color.g ** 2;
          sum.b += color.b ** 2;
          sum.a += color.a ** 2;
          pointsCount++;
        }
      }
    }
    sum.r /= pointsCount;
    sum.g /= pointsCount;
    sum.b /= pointsCount;
    sum.a /= pointsCount;
    return new Color(
      Math.sqrt(sum.r),
      Math.sqrt(sum.g),
      Math.sqrt(sum.b),
      Math.sqrt(sum.a),
    );
  }

  public radius: number = 1;
  public input: INode = undefined;
}
