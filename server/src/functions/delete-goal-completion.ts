import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";

interface DeleteGoalCompletionRequest {
    id: string;
}

export async function deleteGoalCompletion({
    id,
}: DeleteGoalCompletionRequest) {

    const result = await db.delete(goalCompletions).where(eq(goalCompletions.id, id)).returning();

    const goal = result[0];

    return {
        goalCompletion: goal,
    }
}