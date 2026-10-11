import { GoldTitle, GrayTitle } from "@/components/Reusables";

export const AVATARS = [
  { src: "https://randomuser.me/api/portraits/men/32.jpg" },
  { src: "https://randomuser.me/api/portraits/women/44.jpg" },
  { src: "https://randomuser.me/api/portraits/men/76.jpg" },
  { src: "https://randomuser.me/api/portraits/women/68.jpg" },
  { src: "https://randomuser.me/api/portraits/men/12.jpg" },
];

export const LOGOS = [
  { src: "/companies/google.png", alt: "Google" },
  { src: "/companies/amazon.png", alt: "Amazon" },
  { src: "/companies/figma.png", alt: "Figma" },
  { src: "/companies/meta.png", alt: "Meta" },
  { src: "/companies/microsoft.png", alt: "Microsoft" },
  { src: "/companies/netflix.png", alt: "Netflix" },
  { src: "/companies/oracle.png", alt: "Oracle" },
  { src: "/companies/pinterest.png", alt: "Pinterest" },
  { src: "/companies/slack.png", alt: "Slack" },
  { src: "/companies/spotify.png", alt: "Spotify" },
  { src: "/companies/uber.png", alt: "Uber" },
  { src: "/companies/walmart.png", alt: "Walmart" },
];

export const AI_TAGS = [
  { label: "Frontend Engineer", active: true },
  { label: "L5 Level", active: true },
  { label: "React Performance", active: false },
  { label: "System Design", active: false },
  { label: "Behavioural", active: true },
  { label: "DSA", active: false },
];

export const SLOTS = [
  {
    label: "Mon 10:00 AM",
    class: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
  { label: "Mon 2:00 PM", class: "border-white/7 text-stone-500" },
  {
    label: "Tue 11:00 AM",
    class: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
  {
    label: "Wed 9:00 AM ✓",
    class: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  },
  {
    label: "Thu 3:00 PM",
    class: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
];

export const PLANS = [
  {
    name: "Free",
    planId: null,
    price: "$0",
    slug: "free",
    credits: "1 credit / month",
    featured: false,
    features: [
      "1 mock interview session",
      "HD video call via Stream",
      "Persistent chat thread",
    ],
  },
  {
    name: "Starter",
    planId: "cplan_3K3RBomsmLmMW6uvnoXEiLD3VrC",
    price: "$29",
    slug: "starter",
    credits: "5 credits / month",
    featured: true,
    features: [
      "5 mock interview sessions",
      "AI feedback report",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
    ],
  },
  {
    name: "Pro",
    planId: "cplan_3K3RF3ENQAawQSZEtiYrIqBD5wR",
    price: "$69",
    slug: "pro",
    credits: "15 credits / month",
    featured: false,
    features: [
      "15 mock interview sessions",
      "AI feedback report",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
      "Recording & playback link",
    ],
  },
];

export const ROLES = [
  {
    label: "Interviewee",
    title: <GrayTitle>Land the role you deserve</GrayTitle>,
    description:
      "Stop guessing what interviewers want. Practice with people who've been on the other side and know exactly how top companies evaluate candidates.",
    perks: [
      "Browse by category: Frontend, Backend, System Design, PM",
      "Book sessions using monthly credits from your plan",
      "Receive AI-powered feedback after every session",
      "Access session recordings to review your performance",
      "Chat with your interviewer before and after the call",
    ],
  },
  {
    label: "Interviewer",
    title: <GoldTitle>Earn doing what you&apos;re great at</GoldTitle>,
    description:
      "Share your knowledge, help engineers grow, and earn meaningful income on your own schedule. Set your slots, and we handle the rest.",
    perks: [
      "Set your own availability and session rates",
      "AI question generator tailored to each candidate's role",
      "Earn credits per session — withdraw any time",
      "Dashboard with credit balance and withdrawal requests",
    ],
  },
];

export const CATEGORIES = [
  { value: null, label: "All" },
  { value: "FULLSTACK", label: "Full Stack" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "DSA", label: "DSA" },
  { value: "ANDROID", label: "Android" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "BEHAVIORAL", label: "Behavioral" },
];

export const CATEGORY_LABEL = {
  FULLSTACK: "Full Stack",
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DSA: "DSA",
  ANDROID: "android",
  DEVOPS: "DevOps",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
};

export const YEARS_OPTIONS = [
  { value: 1, label: "1 yr" },
  { value: 2, label: "2 yrs" },
  { value: 3, label: "3 yrs" },
  { value: 5, label: "5 yrs" },
  { value: 7, label: "7 yrs" },
  { value: 10, label: "10+ yrs" },
];

export const ONBOARDING_ROLES = [
  {
    value: "INTERVIEWEE",
    icon: "🎯",
    title: "I want to practice",
    description:
      "Browse expert interviewers, book sessions, and get AI-powered feedback to land your dream role.",
  },
  {
    value: "INTERVIEWER",
    icon: "🧑‍💼",
    title: "I want to interview",
    description:
      "Share your expertise, earn credits, and help engineers level up.",
  },
];

export const STATUS_STYLES = {
  SCHEDULED: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  COMPLETED: "border-green-500/20 bg-green-500/10 text-green-400",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-400",
};

export const RATING_STYLES = {
  POOR: "ml-auto border-red-500/20 bg-red-500/10 text-red-400",
  AVERAGE: "ml-auto border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  GOOD: "ml-auto border-blue-500/20 bg-blue-500/10 text-blue-400",
  EXCELLENT: "ml-auto border-green-500/20 bg-green-500/10 text-green-400",
};

export const RATING_LABEL = {
  POOR: "Poor",
  AVERAGE: "Average",
  GOOD: "Good",
  EXCELLENT: "Excellent",
};

export const RATING_CONFIG = {
  POOR: {
    label: "Poor",
    emoji: "📉",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
    bg: "from-red-500/5",
  },
  AVERAGE: {
    label: "Average",
    emoji: "📊",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    bg: "from-yellow-500/5",
  },
  GOOD: {
    label: "Good",
    emoji: "👍",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    bg: "from-blue-500/5",
  },
  EXCELLENT: {
    label: "Excellent",
    emoji: "🏆",
    className: "border-green-500/20 bg-green-500/10 text-green-400",
    bg: "from-green-500/5",
  },
};

export const EXPECT_ITEMS = [
  ["🎥", "HD Video Call", "45-minute session with screen sharing built in."],
  [
    "🤖",
    "AI Question Generator",
    "Role-specific questions generated live during the interview.",
  ],
  [
    "💬",
    "Persistent Chat",
    "Message before and after — share notes, resources, follow-ups.",
  ],
  [
    "📊",
    "AI Feedback Report",
    "Post-interview analysis covering technical depth, communication, and more.",
  ],
  [
    "📹",
    "Recording & Playback",
    "A shareable recording link is generated automatically after the call.",
  ],
];

export const PAYMENT_METHODS = [
  {
    value: "PAYPAL",
    label: "PayPal",
    placeholder: "your@paypal.com",
  },
  {
    value: "BANK",
    label: "Bank Transfer",
    placeholder: "Account / routing info",
  },
  {
    value: "UPI",
    label: "UPI",
    placeholder: "your@upi",
  },
];
