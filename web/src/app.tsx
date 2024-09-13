import { Dialog } from "./components/ui/dialog"
import { CreateGoal } from "./components/create-goal"
import { Summary } from "./components/summary"
import { EmptyGoals } from "./components/empty-goals"
import { useQuery } from "@tanstack/react-query"
import { getSummary } from "./http/get-summary"


export function App() {

  const { data, error, isLoading } =  useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  })

  return (
    <>
      <Dialog>        
        {data?.total ? 
          <Summary />
        :
          <EmptyGoals />
        }

        <CreateGoal />
      </Dialog>
    </>
  )
}