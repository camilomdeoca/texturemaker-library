import { WorleyPointGenerationAlgorithm, WorleyPointSelectionCriteria } from "noises-library";
import { PerlinNoiseNode, WorleyNoiseNode, Color, ColorizeNode, WarpNode, BlurNode } from "../dist/index.js";
import { Vector2 } from "vectors-typescript";
import { parentPort, workerData } from 'worker_threads';

const perlin = new PerlinNoiseNode();
perlin.startingOctaveIndex = 0;
perlin.octavesWeights = [1, 0.5, 0.25, 0.125, 0.0625];
//perlin.octavesWeights = [1, 0.6, 0.2];

const worley = new WorleyNoiseNode();
worley.numberOfPoints = 9;
worley.seed = "14a";
worley.pointGenAlgorithm = WorleyPointGenerationAlgorithm.Random;
worley.pointSelectionCriteria = WorleyPointSelectionCriteria.Closest;

const warp = new WarpNode();
warp.inputs.set("warper", perlin);
warp.inputs.set("warped", worley);
warp.strength = 1.5;

const colorize = new ColorizeNode();
colorize.inputs.set("input", worley);
colorize.colors = [
  {
    lightness: 0,
    color: new Color(0, 1, 0, 1),
  },
  {
    lightness: 1,
    color: new Color(1, 0, 1, 1),
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

