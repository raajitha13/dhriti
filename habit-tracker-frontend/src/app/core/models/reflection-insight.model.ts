import { Reflection } from "./reflection.model";

export interface ReflectionInsight {
    reflectionId: number;
    date: Date;
    highlights: string;
    analysis: string;
    createdAt: Date;
}
// export interface ReflectionInsight {
//   id: number;
//   date: string;
//   reflection: any;
//   highlights: string[];
//   analysis: {
//     completedActivities: string[];
//     completedHabits: string[];
//     blockers: string[];
//     sentiment: keyof typeof SENTIMENT_MAP;
//     tone: string;
//     timeWasters: string[];
//   };
//   createdAt: string;
// }