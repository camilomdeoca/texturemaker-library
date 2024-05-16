import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IGeneratorNode } from "../generatornode.js";
import { PointGenerationAlgorithm, Worley } from "noises-library";

export class WorleyNoiseNode implements IGeneratorNode {
  public constructor() {
    this.recreateWorleyObject();
  }

  public set seed(seed: string) {
    this._seed = seed;
    this.recreateWorleyObject();
  }

  public get seed(): string {
    return this._seed;
  }

  public set numberOfPoints(numberOfPoints: number) {
    this._numberOfPoints = numberOfPoints;
    this.recreateWorleyObject();
  }

  public get numberOfPoints(): number {
    return this._numberOfPoints;
  }

  public set pointGenAlgorithm(pointGenAlgorithm: PointGenerationAlgorithm) {
    this._pointGenAlgorithm = pointGenAlgorithm;
    this.recreateWorleyObject();
  }

  public get pointGenAlgorithm(): PointGenerationAlgorithm {
    return this._pointGenAlgorithm;
  }

  private recreateWorleyObject() {
    this._worleyNoise = new Worley({
      seed: this.seed,
      numPoints: this.numberOfPoints,
      pointGenAlgorithm: this.pointGenAlgorithm,
    });
  }

  public getValueAt(position: Vector2): Color {
    return new Color(this._worleyNoise.at(position));
  }

  private _worleyNoise: Worley;
  public _seed: string = "defaultseed";
  public _numberOfPoints: number = 32;
  public _pointGenAlgorithm: PointGenerationAlgorithm = "halton";
};
