interface CreateGoalRequest {
    title: string;
    desireWeeklyFrequency: number,
}

export async function createGoal({
    title,
    desireWeeklyFrequency
}: CreateGoalRequest) {
    await fetch('http://localhost:3333/goals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            desireWeeklyFrequency
        })
    });
}