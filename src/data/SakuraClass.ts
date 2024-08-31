/* eslint-disable @typescript-eslint/no-unused-vars */
type FnSakura = (x: number, y?: number) => number;

export class Sakura {
  private x: number;
  private s: number;
  private y: number;
  private r: number;

  constructor(public idx: number = 0) {
    this.x = this.getRandom("x") as number;
    this.y = this.getRandom("y") as number;
    this.s = this.getRandom("s") as number;
    this.r = this.getRandom("r") as number;
  }

  //the input array is as long as the number of the total sakura
  public updateSakura = (limitArray: number[]) => {
    this.x = (this.getRandom("fnx") as FnSakura)(this.x, this.y);
    this.y = (this.getRandom("fny") as FnSakura)(this.x, this.y);
    this.r = (this.getRandom("fnr") as FnSakura)(this.r);

    if (
      this.x > window.innerWidth ||
      this.x < 0 ||
      this.y > window.innerHeight ||
      this.y < 0
    ) {
      if (limitArray[this.idx] === -1) {
        this.resetSakura();
      } else if (limitArray[this.idx] > 0) {
        this.resetSakura();
        limitArray[this.idx]--;
      }
    }
  };

  public resetSakura = () => {
    this.r = this.getRandom("fnr") as number;
    if (Math.random() > 0.4) {
      this.x = this.getRandom("x") as number;
      this.y = 0;
      this.s = this.getRandom("s") as number;
      this.r = this.getRandom("r") as number;
    } else {
      this.x = window.innerWidth;
      this.y = this.getRandom("y") as number;
      this.s = this.getRandom("s") as number;
      this.r = this.getRandom("r") as number;
    }
  };

  public getRandom = (option: string) => {
    let ret, random: number;
    switch (option) {
      case "x":
        ret = Math.random() * window.innerWidth;
        break;
      case "y":
        ret = Math.random() * window.innerHeight;
        break;
      case "s":
        ret = Math.random();
        break;
      case "r":
        ret = Math.random() * 6;
        break;
      case "fnx":
        random = -0.5 + Math.random() * 1;
        ret = function (x: number, y: number) {
          return x + 0.5 * random - 1.7;
        };
        break;
      case "fny":
        random = 1.5 + Math.random() * 0.7;
        ret = function (x: number, y: number) {
          return y + random;
        };
        break;
      case "fnr":
        random = Math.random() * 0.03;
        ret = function (r: number) {
          return r + random;
        };
        break;
    }
    return ret;
  };

  public drawSakura = (
    cxt: CanvasRenderingContext2D,
    img: CanvasImageSource
  ) => {
    cxt.save();
    const xc = (40 * this.s) / 4;
    cxt.translate(this.x, this.y);
    cxt.rotate(this.r);
    cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s);
    cxt.restore();
  };
}
