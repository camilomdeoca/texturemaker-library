import { PerlinNoiseNode, WorleyNoiseNode, SolidColorNode, ColorCorrectionNode, CombineNode, Color } from "../dist/index.js";
import { Vector2 } from "vectors-typescript";
import { parentPort, workerData } from 'worker_threads';

const perlin = new PerlinNoiseNode();
perlin.scale.x = 1;
perlin.scale.y = 4;

const worley = new WorleyNoiseNode();
worley.numberOfPoints = 256;
worley.pointGenAlgorithm = "hammersley";

const finalNode = worley;
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

