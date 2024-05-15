import { PerlinNoiseNode, WorleyNoiseNode, SolidColorNode, ColorCorrectionNode, CombineNode, Color, ColorizeNode } from "../dist/index.js";
import { Vector2 } from "vectors-typescript";
import { parentPort, workerData } from 'worker_threads';

const perlin = new PerlinNoiseNode();
perlin.startingOctaveIndex = 2;

const worley = new WorleyNoiseNode();
worley.numberOfPoints = 256;
worley.pointGenAlgorithm = "hammersley";

const colorCorrection = new ColorCorrectionNode();
colorCorrection.input = perlin;
colorCorrection.contrast = 1.8;

const colorize = new ColorizeNode();
colorize.input = colorCorrection;
colorize.colors = [
  {
    lightness: 0,
    color: new Color(1, 0, 0, 1),
  },
  {
    lightness: 0.5,
    color: new Color(0, 1, 0, 1),
  },
  {
    lightness: 1,
    color: new Color(0, 0, 1, 1),
  },
];

console.log(colorize.getValueAt(new Vector2(0, 0)));

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

