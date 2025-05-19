import { Habit } from "./habit.model";

export interface HabitCompletion{
    habit: Habit;
    completedDate: Date;
}