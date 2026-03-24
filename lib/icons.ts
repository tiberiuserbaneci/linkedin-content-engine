// Keyword → Iconify icon name mapping
const KEYWORD_ICON_MAP: Record<string, string> = {
  research: "tabler:search",
  search: "tabler:search",
  find: "tabler:search",
  email: "tabler:mail",
  mail: "tabler:mail",
  revenue: "tabler:trending-up",
  growth: "tabler:trending-up",
  income: "tabler:trending-up",
  agents: "tabler:robot",
  agent: "tabler:robot",
  ai: "tabler:robot",
  automation: "tabler:robot",
  automate: "tabler:robot",
  content: "tabler:writing",
  write: "tabler:writing",
  writing: "tabler:writing",
  post: "tabler:writing",
  monitor: "tabler:activity",
  tracking: "tabler:activity",
  analytics: "tabler:activity",
  sales: "tabler:currency-dollar",
  money: "tabler:currency-dollar",
  pricing: "tabler:currency-dollar",
  cost: "tabler:currency-dollar",
  budget: "tabler:currency-dollar",
  code: "tabler:code",
  developer: "tabler:code",
  programming: "tabler:code",
  build: "tabler:code",
  data: "tabler:database",
  database: "tabler:database",
  storage: "tabler:database",
  users: "tabler:users",
  team: "tabler:users",
  people: "tabler:users",
  community: "tabler:users",
  audience: "tabler:users",
  clock: "tabler:clock",
  time: "tabler:clock",
  schedule: "tabler:clock",
  speed: "tabler:clock",
  check: "tabler:circle-check",
  done: "tabler:circle-check",
  complete: "tabler:circle-check",
  success: "tabler:circle-check",
  verify: "tabler:circle-check",
  warning: "tabler:alert-triangle",
  risk: "tabler:alert-triangle",
  danger: "tabler:alert-triangle",
  caution: "tabler:alert-triangle",
  star: "tabler:star",
  quality: "tabler:star",
  premium: "tabler:star",
  favorite: "tabler:star",
  chart: "tabler:chart-bar",
  metrics: "tabler:chart-bar",
  report: "tabler:chart-bar",
  dashboard: "tabler:chart-bar",
  brain: "tabler:brain",
  thinking: "tabler:brain",
  strategy: "tabler:brain",
  intelligence: "tabler:brain",
  smart: "tabler:brain",
  rocket: "tabler:rocket",
  launch: "tabler:rocket",
  startup: "tabler:rocket",
  scale: "tabler:rocket",
  fire: "tabler:flame",
  hot: "tabler:flame",
  trending: "tabler:flame",
  viral: "tabler:flame",
  tool: "tabler:tool",
  tools: "tabler:tool",
  stack: "tabler:stack-2",
  workflow: "tabler:arrows-right",
  process: "tabler:arrows-right",
  step: "tabler:arrows-right",
  link: "tabler:link",
  connect: "tabler:link",
  integrate: "tabler:link",
  target: "tabler:target",
  goal: "tabler:target",
  focus: "tabler:target",
  idea: "tabler:bulb",
  insight: "tabler:bulb",
  tip: "tabler:bulb",
  learn: "tabler:book",
  education: "tabler:book",
  guide: "tabler:book",
  security: "tabler:shield-check",
  protect: "tabler:shield-check",
  safe: "tabler:shield-check",
  settings: "tabler:settings",
  config: "tabler:settings",
  optimize: "tabler:settings",
  share: "tabler:share",
  social: "tabler:share",
  network: "tabler:share",
  download: "tabler:download",
  export: "tabler:download",
  save: "tabler:download",
  message: "tabler:message-circle",
  chat: "tabler:message-circle",
  comment: "tabler:message-circle",
  engage: "tabler:message-circle",
  heart: "tabler:heart",
  love: "tabler:heart",
  like: "tabler:heart",
  photo: "tabler:photo",
  image: "tabler:photo",
  visual: "tabler:photo",
  video: "tabler:video",
  play: "tabler:player-play",
  list: "tabler:list",
  organize: "tabler:list",
  plan: "tabler:list",
  lock: "tabler:lock",
  private: "tabler:lock",
  world: "tabler:world",
  global: "tabler:world",
  international: "tabler:world",
  phone: "tabler:phone",
  call: "tabler:phone",
  mobile: "tabler:device-mobile",
  app: "tabler:device-mobile",
  cloud: "tabler:cloud",
  saas: "tabler:cloud",
  platform: "tabler:cloud",
};

// Company name → domain mapping for Logo.dev
const COMPANY_DOMAINS: Record<string, string> = {
  notion: "notion.so",
  slack: "slack.com",
  n8n: "n8n.io",
  claude: "anthropic.com",
  anthropic: "anthropic.com",
  apollo: "apollo.io",
  openai: "openai.com",
  chatgpt: "openai.com",
  zapier: "zapier.com",
  make: "make.com",
  airtable: "airtable.com",
  hubspot: "hubspot.com",
  salesforce: "salesforce.com",
  stripe: "stripe.com",
  figma: "figma.com",
  canva: "canva.com",
  github: "github.com",
  vercel: "vercel.com",
  supabase: "supabase.com",
  firebase: "firebase.google.com",
  google: "google.com",
  microsoft: "microsoft.com",
  linkedin: "linkedin.com",
  twitter: "twitter.com",
  youtube: "youtube.com",
  instagram: "instagram.com",
  tiktok: "tiktok.com",
  shopify: "shopify.com",
  wordpress: "wordpress.com",
  mailchimp: "mailchimp.com",
  intercom: "intercom.com",
  loom: "loom.com",
  calendly: "calendly.com",
  typeform: "typeform.com",
  webflow: "webflow.com",
  framer: "framer.com",
  linear: "linear.app",
  asana: "asana.com",
  trello: "trello.com",
  jira: "atlassian.com",
  confluence: "atlassian.com",
  dropbox: "dropbox.com",
  zoom: "zoom.us",
  discord: "discord.com",
  twilio: "twilio.com",
  aws: "aws.amazon.com",
  azure: "azure.microsoft.com",
  gcp: "cloud.google.com",
  docker: "docker.com",
  kubernetes: "kubernetes.io",
  mongodb: "mongodb.com",
  postgres: "postgresql.org",
  redis: "redis.io",
  elasticsearch: "elastic.co",
  datadog: "datadoghq.com",
  segment: "segment.com",
  mixpanel: "mixpanel.com",
  amplitude: "amplitude.com",
  sendgrid: "sendgrid.com",
  postmark: "postmarkapp.com",
  plaid: "plaid.com",
  gong: "gong.io",
  clay: "clay.com",
  lemlist: "lemlist.com",
  instantly: "instantly.ai",
  phantombuster: "phantombuster.com",
  ultron: "51ultron.com",
};

const LOGO_DEV_TOKEN = "pk_X0wdB1MQRmWLGQMiPwH2Wg";

/**
 * Returns an Iconify icon name for a given keyword.
 * Falls back to "tabler:point" if no match found.
 */
export function getIconForKeyword(keyword: string): string {
  const lower = keyword.toLowerCase().trim();

  // Direct match
  if (KEYWORD_ICON_MAP[lower]) return KEYWORD_ICON_MAP[lower];

  // Partial match — check if any key is contained in the keyword
  for (const [key, icon] of Object.entries(KEYWORD_ICON_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return icon;
  }

  return "tabler:point";
}

/**
 * Returns a Logo.dev URL for a company name.
 * Returns null if the company is not recognized.
 */
export function getCompanyLogo(companyName: string): string | null {
  const lower = companyName.toLowerCase().trim();
  const domain = COMPANY_DOMAINS[lower];
  if (!domain) return null;
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;
}

/**
 * Check if a text likely refers to a known company.
 * Returns the company key if found, null otherwise.
 */
export function detectCompany(text: string): string | null {
  const lower = text.toLowerCase();
  for (const key of Object.keys(COMPANY_DOMAINS)) {
    if (lower.includes(key)) return key;
  }
  return null;
}
