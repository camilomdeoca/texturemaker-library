import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IGeneratorNode } from "../generatornode.js";
import { Perlin } from "noises-library";
import { INode } from "../node.js";

// TODO: Instead of recreating when a parameter changes set a boolean value that indicates that the
// Perlin object needs to be recreated

export class PerlinNoiseNode implements IGeneratorNode {
  constructor() {
    this.recreatePerlinObject();
  }

  get inputs(): Map<string, INode | undefined> {
    return new Map();
  }

  getValueAt(position: Vector2): Color {
    return new Color(this._perlinNoise.at(position));
  }

  private recreatePerlinObject(): void {
    this._perlinNoise = new Perlin({
      startingOctaveIndex: this._startingOctaveIndex,
      octavesWeights: this.octavesWeights,
      seed: this.seed,
      scale: this._scale
    });
  }

  public set startingOctaveIndex(startingOctaveIndex: number) {
      this._startingOctaveIndex = startingOctaveIndex;
      this.recreatePerlinObject();
  }

  public get startingOctaveIndex(): number {
      return this._startingOctaveIndex;
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
    const numOctaves = 4;
    const weights = Array<number>(numOctaves);

    let weight = 1;
    for (let i = 0; i < numOctaves; i++) {
      weights[i] = weight;
      weight *= 0.5;
    }
    return weights;
  }

  private _startingOctaveIndex: number = 4;
  private _scale: Vector2 = new Vector2(1.0, 1.0);
  private _perlinNoise: Perlin;
  private _seed: string = undefined;
  private _octavesWeights: number[] = this.genDefaultOctavesWeights();
};
