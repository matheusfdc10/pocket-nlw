import { Check, Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { getPendingGoals } from "../http/get-pending-goals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGoalCompletion } from "../http/create-goal-completion";

export function PendingGoals() {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['pending-goals'],
        queryFn: getPendingGoals,
        staleTime: 1000 * 60,
    })
    
    // async function handleCompleteGoal(goalId: string) {
    //     await createGoalCompletion(goalId);
    //     queryClient.invalidateQueries({ queryKey: ['summary'] })
    //     queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    // }

    const { mutate: handleCompleteGoal, isPending } = useMutation({
        mutationFn: createGoalCompletion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
        }
    });

    return (
        <div className="flex flex-wrap gap-3">
            {data?.map((goal) => {
                const isCompleted = goal.completionCount >= goal.desireWeeklyFrequency
                return (
                    <OutlineButton 
                        key={goal.id} 
                        disabled={isCompleted || isPending}
                        onClick={() => handleCompleteGoal(goal.id)}
                    >
                        {isCompleted ?
                            <Check className="size-4 text-zinc-600"/>
                        :
                            <Plus className="size-4 text-zinc-600" />
                        }
                        {goal.title}
                    </OutlineButton>
                )
            })}
        </div>
    )
}