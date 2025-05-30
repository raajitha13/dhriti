import random

def generate_motivational_quote(streak: int, longest_streak: int, total_completions: int) -> str:
    quotes = [
        "Still water, steady bloom. Still effort, steady you.",
        "Even in the shadows, a lotus blooms — keep rising 🌸",
        "Steady steps beat sudden leaps. Stay consistent.",
        "You're not just checking boxes, you're building a life.",
        "Discipline isn't harsh — it's self-love in action.",
        "Small habits. Big results. You're proving it.",
        "Consistency is your secret weapon.",
        "Every day you show up, you grow.",
        "Lotus roots in the mud, but rises above — just like you.",
        "You're not starting from scratch. You're starting from experience.",
        "You're in your comeback era — daily."
    ]

    # Bonus boost lines depending on current streak
    boost = ""
    if streak >= 30:
        boost = "🔥 30-day streak? You're built different!"
    elif streak >= 15:
        boost = "💪 This streak's no joke — keep it alive!"
    elif streak >= 7:
        boost = "⚡ One week down — you’ve got rhythm."

    return f"{random.choice(quotes)} {boost}"

# summary for each habit
def generate_weekly_summary(streak: int, longest_streak: int, total_completions: int) -> str:
    parts = []

    # Streak analysis
    if streak > 0:
        parts.append(f"You're currently on a {streak}-day streak.")
    else:
        parts.append("Looks like your streak is reset — time to bounce back!")

    # Compare to longest streak
    if longest_streak > 0:
        if streak == longest_streak:
            parts.append("You've just matched your personal best! 🚀")
        elif streak > longest_streak:
            parts.append("You’ve broken your longest streak ever! 🏆")
        else:
            diff = longest_streak - streak
            if diff <= 3:
                parts.append(f"Just {diff} day(s) away from breaking your record streak of {longest_streak}.")
            else:
                parts.append(f"Your longest streak so far is {longest_streak}. Keep building!")

    # Completion insights
    if total_completions > 100:
        parts.append("You've logged over 100 completions — beast mode! 💯")
    elif total_completions > 50:
        parts.append("50+ completions already — serious consistency.")
    elif total_completions > 20:
        parts.append("You’re gaining momentum — over 20 habits crushed.")
    else:
        parts.append("Every start matters. Keep stacking those completions.")

    parts.append("Remember, growth lives in the daily — not the someday.")

    return " ".join(parts)

def generate_weekly_summary_from_habits(habits: list[dict]) -> str:
    if not habits:
        return "No habits tracked this week — but that's okay. A blank page is just a beginning. 🌱"

    total_completions = sum(h["totalCompletedDays"] for h in habits)
    current_streaks = [h["currentStreak"] for h in habits]
    longest_streaks = [h["longestStreak"] for h in habits]

    active_streaks_count = sum(1 for s in current_streaks if s > 0)
    habits_on_fire_count = sum(1 for s in current_streaks if s >= 7)
    zero_streak_count = sum(1 for s in current_streaks if s == 0)

    max_current_streak = max(current_streaks, default=0)
    max_longest_streak = max(longest_streaks, default=0)

    total_habits = len(habits)

    parts = []

    # 🔥 Active habit tracking
    if active_streaks_count == total_habits:
        parts.append("All your habits are active — you're unstoppable right now! 💥")
    elif active_streaks_count > 0:
        parts.append(f"{active_streaks_count}/{total_habits} habit(s) are active — nice rhythm.")
    else:
        parts.append("All streaks are reset — but it’s never too late to restart. Fresh week, fresh shot! 🌀")

    # 🔥 On fire habits
    if habits_on_fire_count > 0:
        parts.append(f"{habits_on_fire_count} habit(s) are on fire 🔥 — incredible consistency.")

    # 📈 Streak highlight
    if max_current_streak >= 30:
        parts.append(f"One of your habits hit a 30+ day streak — that’s legendary! 🏆")
    elif max_current_streak >= 15:
        parts.append("Mid-streak grind! A 15+ day run shows serious commitment.")
    elif max_current_streak >= 7:
        parts.append("One of your habits has hit a solid weekly streak. Momentum is real!")

    # 🧱 Streak comeback push
    if zero_streak_count > 0 and active_streaks_count > 0:
        parts.append(f"{zero_streak_count} habit(s) are waiting for your comeback. Let’s revive them!")

    # 🧮 Completion count milestones
    if total_completions > 100:
        parts.append("You've crossed 100 completions overall — absolute beast mode! 💯")
    elif total_completions > 50:
        parts.append("50+ completions in the bag — you’re making serious progress.")
    elif total_completions > 20:
        parts.append("20+ completions already — solid momentum.")
    else:
        parts.append("Every start counts. Keep stacking those small wins.")

    # 🧠 Closing encouragement
    parts.append("Your journey isn’t about perfection — it’s about showing up. Keep going. 🚶‍♂️🌱")

    return " ".join(parts)

