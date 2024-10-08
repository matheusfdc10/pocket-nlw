import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitiIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR"
import { PendingGoals } from "./pending-goals";
import { deleteGoalCompletion } from "../http/delete-goal-completion";
dayjs.locale(ptBR)

export function Summary() {
    const queryClient = useQueryClient();

    const { data, error, isLoading } =  useQuery({
        queryKey: ['summary'],
        queryFn: getSummary,
        staleTime: 1000 * 60,
    })

    const firstDayOfWeek = dayjs().startOf('week').format('D MMM');
    const lastDayOfWeek = dayjs().endOf('week').format('D MMM');

    const completedPercentage = Math.round(data ? (data?.completed * 100 / data?.total) : 0)

    async function handleDeleteGoalComplete(id: string) {
        await deleteGoalCompletion(id);
        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    }

    return (
        <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <InOrbitiIcon />
                    <span className="text-lg font-semibold">{firstDayOfWeek} - {lastDayOfWeek}</span>
                </div>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Plus className="size-4"/>
                        Cadastrar meta
                    </Button>
                </DialogTrigger>
            </div>

            <div className="flex flex-col gap-3">
                <Progress value={data?.completed} max={data?.total}>
                    <ProgressIndicator style={{
                        width: `${completedPercentage}%`
                    }} />
                </Progress>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>
                        Você completou <span className="text-zinc-100">{data?.completed}</span> de <span className="text-zinc-100">{data?.total}</span> metas nessa semana.
                    </span>
                    <span>
                        {completedPercentage}%
                    </span>
                </div>
            </div>

            <Separator />

            <PendingGoals />

            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-medium">Sua semana</h2>
                
                {data?.goalsPerDay ? 
                    Object.entries(data?.goalsPerDay).map(([date, goals]) => {
                        const weekDay = dayjs(date).format('dddd')
                        const formatedDate = dayjs(date).format('D[ de ]MMM')
                        return (
                            <div key={date} className="flex flex-col gap-4">
                                <h3 className="font-medium">
                                    <span className="capitalize">{weekDay}</span>{' '}
                                    <span className="text-zinc-400 text-xs">({formatedDate})</span>
                                </h3>
    
                                <ul className="flex flex-col gap-3">
                                    {goals.map((goal) => {
                                        const time = dayjs(goal.completedAt).format('HH:mm')
    
                                        return (
                                            <li key={goal.id} className="flex items-center gap-2">
                                                <CheckCircle2 className="size-4 text-pink-500"/>
                                                <span className="text-sm text-zinc-400">
                                                    Você completou <span className="text-zinc-100">"{goal.title}"</span> às <span className="text-zinc-100">{time}h</span>
                                                </span>
                                                <button onClick={() => handleDeleteGoalComplete(goal.id)} className="text-sm text-zinc-400 underline hover:text-zinc-300">
                                                    Desfazer
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })
                 : 
                    <span className="text-center text-zinc-300 text-sm">
                        Nenhuma meta feita essa semana!
                    </span>
                }
            </div>
        </div>
    )
}