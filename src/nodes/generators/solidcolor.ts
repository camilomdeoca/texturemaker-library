import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IGeneratorNode } from "../generatornode.js";

export class SolidColorNode implements IGeneratorNode {
    public getValueAt(_position: Vector2): Color {
        return this.color;
    }

    public color: Color = new Color(1.0, 1.0, 1.0, 1.0);
}
