import { WorleyPointGenerationAlgorithm, WorleyPointSelectionCriteria } from "noises-library";
import { PerlinNoiseNode, WorleyNoiseNode, Color, ColorizeNode, WarpNode, BlurNode } from "../dist/index.js";
import { Vector2 } from "vectors-typescript";
import { parentPort, workerData } from 'worker_threads';

const perlin = new PerlinNoiseNode();
perlin.startingOctaveIndex = 3;
perlin.octavesWeights = [1, 0.6, 0.2];

const worley = new WorleyNoiseNode();
worley.numberOfPoints = 9;
worley.seed = "14a";
worley.pointGenAlgorithm = WorleyPointGenerationAlgorithm.Random;
worley.pointSelectionCriteria = WorleyPointSelectionCriteria.SecondMinusClosest;

const warp = new WarpNode();
warp.inputs["warper"] = perlin;
warp.inputs["warped"] = worley;
warp.strength = 1.5;

const colorize = new ColorizeNode();
colorize.inputs["input"] = warp;
colorize.colors = [
  {
    lightness: 0,
    color: new Color(0, 0.8, 1, 1),
  },
  {
    lightness: 0.3,
    color: new Color(0, 0.6, 1, 1),
  },
  {
    lightness: 0.7,
    color: new Color(0, 0.8, 1, 1),
  },
];

const blur = new BlurNode();
blur.input = colorize;
blur.radius = 1;

const finalNode = colorize;
const pixels = new Uint8ClampedArray(workerData.sharedBuffer);
for (let y = workerData.startY; y < workerData.endY; y++) {
  for (let x = 0; x < workerData.size.width; x++) {
    const color = finalNode.getValueAt(new Vector2(x / workerData.size.width, y / workerData.size.height));
    pixels[(y * workerData.size.width + x) * 4 + 0] = color.r * 255;
    pixels[(y * workerData.size.width + x) * 4 + 1] = color.g * 255;
    pixels[(y * workerData.size.width + x) * 4 + 2] = color.b * 255;
    pixels[(y * workerData.size.width + x) * 4 + 3] = color.a * 255;
  }
}
parentPort.postMessage("done");

