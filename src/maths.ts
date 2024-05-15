const clamp = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
}

const lerp = (val1: number, val2: number, factor: number): number => {
  return val1 * (1 - factor) + val2 * factor;
};

export { clamp, lerp };
