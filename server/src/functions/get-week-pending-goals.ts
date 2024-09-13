import dayjs from "dayjs";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

export async function getWeekPendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const latestDayOfWeek = dayjs().endOf('week').toDate();

    const goalCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                desireWeeklyFrequency: goals.desireWeeklyFrequency,
                createdAt: goals.createdAt,
            })
            .from(goals)
            .where(lte(goals.createdAt, latestDayOfWeek))
    )

    const goalsCompletionCounts = db.$with('goal_completion_counts').as(
        db
            .select({
                goalId: goalCompletions.goalId,
                completionCount: count(goalCompletions.id).as('completionCount'),
            })
            .from(goalCompletions)
            .where(and(
                gte(goalCompletions.createdAt, firstDayOfWeek),
                lte(goalCompletions.createdAt, latestDayOfWeek)
            ))
            .groupBy(goalCompletions.goalId)
    )

    const pendingGoals = await db
        .with(goalCreatedUpToWeek, goalsCompletionCounts)
        .select({
            id: goalCreatedUpToWeek.id,
            title: goalCreatedUpToWeek.title,
            desireWeeklyFrequency: goalCreatedUpToWeek.desireWeeklyFrequency,
            completionCount: sql`
                COALESCE(${goalsCompletionCounts.completionCount}, 0)
            `.mapWith(Number)
        })
        .from(goalCreatedUpToWeek)
        .leftJoin(goalsCompletionCounts, eq(goalsCompletionCounts.goalId, goalCreatedUpToWeek.id))

    return {
        pendingGoals
    }
}