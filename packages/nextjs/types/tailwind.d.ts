import type { Config } from "tailwindcss";

declare module "tailwindcss" {
  interface Config {
    daisyui?: {
      themes?: Array<Record<string, Record<string, string>>>;
      darkTheme?: string;
      base?: boolean;
      styled?: boolean;
      utils?: boolean;
      prefix?: string;
      logs?: boolean;
      themeRoot?: string;
    };
  }
}
