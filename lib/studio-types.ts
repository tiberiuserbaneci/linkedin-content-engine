export interface InfographicContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  metrics: { value: string; label: string }[];
  sections: {
    title: string;
    bullets: string[];
  }[];
}

export interface CheatsheetContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: {
    title: string;
    items: string[];
  }[];
  comparison?: {
    headers: string[];
    rows: { label: string; values: string[] }[];
  };
  verdict?: string;
}

export interface CarouselContent {
  title: string;
  slides: {
    title: string;
    bullets: string[];
  }[];
  cta: {
    headline: string;
    subtext: string;
  };
}

export interface PostCoverContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export type StudioContent =
  | InfographicContent
  | CheatsheetContent
  | CarouselContent
  | PostCoverContent;
