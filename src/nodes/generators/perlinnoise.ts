import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IGeneratorNode } from "../generatornode.js";
import { Perlin } from "noises-library";

export class PerlinNoiseNode implements IGeneratorNode {
  constructor() {
    this.recreatePerlinObject();
  }

  getValueAt(position: Vector2): Color {
    return new Color(this._perlinNoise.at(position));
  }

  private recreatePerlinObject(): void {
    this._perlinNoise = new Perlin(this.octavesWeights, this.seed, {
      scale: this._scale
    });
  }

  public set scale(scale: Vector2) {
    this._scale = scale;
    this.recreatePerlinObject();
  }

  public get scale(): Vector2 {
    return this._scale;
  }

  public set seed(seed: string) {
    this._seed = seed;
    this.recreatePerlinObject();
  }

  public get seed(): string {
    return this._seed;
  }

  public set octavesWeights(weights: number[]) {
    this._octavesWeights = weights;
    this.recreatePerlinObject();
  }

  public get octavesWeights(): number[] {
    return this._octavesWeights;
  }

  private genDefaultOctavesWeights(): number[] {
    const defaultMaxWeights = 8;
    const defaultMinWeights = 3;
    const weights = Array<number>(defaultMaxWeights).fill(0);

    let initialWeight = 1;
    for (let i = defaultMinWeights - 1; i < defaultMaxWeights; i++) {
      weights[i] = initialWeight;
      initialWeight *= 0.5;
    }
    return weights;
  }

  private _scale: Vector2 = new Vector2(1.0, 1.0);
  private _perlinNoise: Perlin;
  private _seed: string = undefined;
  private _octavesWeights: number[] = this.genDefaultOctavesWeights();
};