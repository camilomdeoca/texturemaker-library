import { Vector2 } from "vectors-typescript";
import { Color } from "../../color.js";
import { IGeneratorNode } from "../generatornode.js";
import { WorleyPointGenerationAlgorithm, Worley, WorleyPointSelectionCriteria } from "noises-library";
import { INode } from "../node.js";

export class WorleyNoiseNode implements IGeneratorNode {
  public constructor() {
    this.recreateWorleyObject();
  }

  get inputs(): Map<string, INode> {
    return new Map();
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

  public set pointGenAlgorithm(pointGenAlgorithm: WorleyPointGenerationAlgorithm) {
    this._pointGenAlgorithm = pointGenAlgorithm;
    this.recreateWorleyObject();
  }

  public get pointGenAlgorithm(): WorleyPointGenerationAlgorithm {
    return this._pointGenAlgorithm;
  }

  public set pointSelectionCriteria(pointSelectionCriteria: WorleyPointSelectionCriteria) {
    this._pointSelectionCriteria = pointSelectionCriteria;
    this.recreateWorleyObject();
  }

  public get pointSelectionCriteria(): WorleyPointSelectionCriteria {
    return this._pointSelectionCriteria;
  }

  private recreateWorleyObject() {
    this._worleyNoise = new Worley({
      seed: this.seed,
      numPoints: this.numberOfPoints,
      pointGenAlgorithm: this.pointGenAlgorithm,
      pointSelectionCriteria: this.pointSelectionCriteria,
    });
  }

  public getValueAt(position: Vector2): Color {
    return new Color(this._worleyNoise.at(position));
  }

  private _worleyNoise: Worley;
  private _seed: string = "defaultseed";
  private _numberOfPoints: number = 32;
  private _pointGenAlgorithm: WorleyPointGenerationAlgorithm = "halton";
  private _pointSelectionCriteria: WorleyPointSelectionCriteria = "closest";
};
