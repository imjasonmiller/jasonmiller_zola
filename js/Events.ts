export type ActiveTheme = "light" | "dark";

export class ThemeEvent extends Event {
  constructor(public theme: ActiveTheme) {
    super("themechange");
  }
}

export class MobileEvent extends Event {
  constructor(public isMobile: boolean) {
    super("ismobile");
  }
}
