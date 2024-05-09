import { Color, PerlinNoiseNode, SolidColorNode, CombineNode, ColorCorrectionNode } from '../dist/index.js'
import { Vector2 } from 'vectors-typescript';

const canvas = document.getElementsByTagName('canvas')[0];
const size = 512
canvas.width = size;
canvas.height = size;

const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(canvas.width, canvas.height);

const data = imageData.data;

const start = Date.now();

const perlin = new PerlinNoiseNode();
perlin.scale.x = 1;
perlin.scale.y = 4;

const solidColor = new SolidColorNode();
solidColor.color = new Color(1.0, 0.0, 0.0, 1.0);

const combine = new CombineNode();
combine.inputs.first = perlin;
combine.inputs.second = solidColor;
combine.factor = 0.3;

const colorCorrection = new ColorCorrectionNode();
colorCorrection.input = combine;
colorCorrection.contrast = 1.5;
colorCorrection.saturation = 1.5;
colorCorrection.brightness = 1.0;
colorCorrection.gamma = 2.2;

const finalNode = colorCorrection;
for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    const color = finalNode.getValueAt(new Vector2(x / canvas.width, y / canvas.height));

    data[(y * canvas.width + x) * 4 + 0] = color.r * 255;
    data[(y * canvas.width + x) * 4 + 1] = color.g * 255;
    data[(y * canvas.width + x) * 4 + 2] = color.b * 255;
    data[(y * canvas.width + x) * 4 + 3] = color.a * 255;
  }
}

const end = Date.now();
console.log('Rendered in ' + (end - start) + ' ms');

ctx.putImageData(imageData, 0, 0);

ctx.font = '16px sans-serif'
ctx.textAlign = 'center';
ctx.fillText('Rendered in ' + (end - start) + ' ms', canvas.width / 2, canvas.height - 20);


