import { EventKind, type PostRequest, type UserRole } from "@/backend";

export type { EventKind, PostRequest, UserRole };

export interface EventConfig {
  kind: EventKind;
  label: string;
  emoji: string;
  template: string;
  hashtags: string[];
}

export const EVENT_CONFIGS: EventConfig[] = [
  {
    kind: EventKind.Marriage,
    label: "Marriage",
    emoji: "💍",
    template:
      "I just got married! Today is the happiest day of my life. Here's to a beautiful journey ahead with my partner!",
    hashtags: ["#TweetMyMoment", "#JustMarried", "#Wedding"],
  },
  {
    kind: EventKind.Promotion,
    label: "Promotion",
    emoji: "🎉",
    template:
      "Thrilled to share that I've received a promotion at work! Hard work truly pays off. Grateful for this incredible opportunity!",
    hashtags: ["#TweetMyMoment", "#Promoted", "#CareerMilestone"],
  },
  {
    kind: EventKind.NewJob,
    label: "New Job",
    emoji: "💼",
    template:
      "Excited to announce I'm starting a new chapter in my career! Can't wait to bring my best to this new role.",
    hashtags: ["#TweetMyMoment", "#NewJob", "#NewBeginnings"],
  },
  {
    kind: EventKind.NewBaby,
    label: "New Baby",
    emoji: "👶",
    template:
      "Our family just grew by two tiny feet! Welcoming our precious little one into the world. Our hearts are completely full!",
    hashtags: ["#TweetMyMoment", "#NewBaby", "#ParentingJoy"],
  },
  {
    kind: EventKind.Birthday,
    label: "Birthday",
    emoji: "🎂",
    template:
      "Another year wiser! 🎂 Celebrating my birthday today and feeling so grateful for all the love and support. Here's to a year filled with joy and new adventures!",
    hashtags: ["#TweetMyMoment", "#BirthdayCelebration"],
  },
  {
    kind: EventKind.Graduation,
    label: "Graduation",
    emoji: "🎓",
    template:
      "I did it! So proud to announce that I have officially graduated! Years of dedication and hard work have finally paid off. The future is bright!",
    hashtags: ["#TweetMyMoment", "#Graduated", "#ClassOf2026"],
  },
  {
    kind: EventKind.Other,
    label: "Other",
    emoji: "✨",
    template: "",
    hashtags: ["#TweetMyMoment"],
  },
];
