import { lerp } from "./maths.js";

export class Color {
  public constructor(
    r: number,
    g?: number,
    b?: number,
    a?: number,
  ) {
    this.r = r;
    this.g = g !== undefined ? g : r;
    this.b = b !== undefined ? b : r;
    this.a = a !== undefined ? a : 1;
  }

  // https://en.wikipedia.org/wiki/HSL_and_HSV
  public toHsl(): HslColor {
    const max = Math.max(this.r, this.g, this.b);
    const min = Math.min(this.r, this.g, this.b);
    const c = max - min;

    let result = new HslColor(
      undefined,
      undefined,
      (max + min) / 2,
      this.a
    );

    if (c == 0) {
      result.h = result.s = 0;
    } else {
      result.s = result.l == 0 || result.l == 1 ? 0 : (c / 2) / Math.min(result.l, 1 - result.l);

      if (max == this.r) {
        result.h = (this.g - this.b) / c + (this.g < this.b ? 6 : 0);
      } else if (max == this.g) {
        result.h = (this.b - this.r) / c + 2;
      } else if (max == this.b) {
        result.h = (this.r - this.g) / c + 4;
      }

      result.h /= 6;
    }

    return result;
  }

  public static lerp(col1: Color, col2: Color, factor: number): Color {
    return new Color(
      Math.sqrt(lerp(col1.r**2, col2.r**2, factor)),
      Math.sqrt(lerp(col1.g**2, col2.g**2, factor)),
      Math.sqrt(lerp(col1.b**2, col2.b**2, factor)),
      lerp(col1.a, col2.a, factor),
    );
  }

  public r: number; // in range [0, 1]
  public g: number; // in range [0, 1]
  public b: number; // in range [0, 1]
  public a: number; // in range [0, 1]
}

export class HslColor {
  public constructor(h: number, s: number, l: number, a: number) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
  }
  // https://en.wikipedia.org/wiki/HSL_and_HSV
  public toRgb(): Color {
    const a = this.s * Math.min(this.l, 1 - this.l);
    const f = (n: number): number => {
      const k = (n + this.h * 12) % 12;
      return this.l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      //const k = (n + this.h) % 1;
      //return this.l - a * Math.max(-1, 12*Math.min(k - 1/4, 3/4 - k, 1/12));
    };
    return new Color(
      f(0),
      f(8),
      f(4),
      this.a
    );
  }

  public static lerp(col1: HslColor, col2: HslColor, factor: number): HslColor {
    return new HslColor(
      lerp(col1.h, col2.h, factor),
      lerp(col1.s, col2.s, factor),
      lerp(col1.l, col2.l, factor),
      lerp(col1.a, col2.a, factor),
    );
  }

  public h: number; // in range [0, 1]
  public s: number; // in range [0, 1]
  public l: number; // in range [0, 1]
  public a: number; // in range [0, 1]
}
