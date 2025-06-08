from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from generator import  generate_motivational_quote, generate_weekly_summary_from_habits

app = FastAPI()

class HabitStats(BaseModel):
    name: str
    currentStreak: int
    longestStreak: int
    totalCompletedDays: int

class HabitList(BaseModel):
    habits: List[HabitStats]

@app.post("/quote")
def get_quote_only(data: HabitList):
    habits = [habit.dict() for habit in data.habits]

    max_streak = max((h["currentStreak"] for h in habits), default=0)
    max_longest = max((h["longestStreak"] for h in habits), default=0)
    total_completions = sum(h["totalCompletedDays"] for h in habits)

    quote = generate_motivational_quote(max_streak, max_longest, total_completions)

    return { "motivational_quote": quote }

@app.post("/summary")
def get_summary_only(data: HabitList):
    habits = [habit.dict() for habit in data.habits]
    summary = generate_weekly_summary_from_habits(habits)

    return { "weekly_summary": summary }

@app.post("/generate")
def generate_quote_summary(data: HabitList):
    habits = [habit.dict() for habit in data.habits]

    max_streak = max((h["currentStreak"] for h in habits), default=0)
    max_longest = max((h["longestStreak"] for h in habits), default=0)
    total_completions = sum(h["totalCompletedDays"] for h in habits)

    quote = generate_motivational_quote(max_streak, max_longest, total_completions)
    summary = generate_weekly_summary_from_habits(habits)

    return {
        "motivational_quote": quote,
        "weekly_summary": summary
    }
