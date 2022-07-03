export class Day {
  day: string;
  month: string;
  year: string;
  selected: boolean;
  constructor(d: string, m: string, y: string, s: boolean) {
    this.day = d;
    this.month = m;
    this.year = y;
    this.selected = s;
  }
}
