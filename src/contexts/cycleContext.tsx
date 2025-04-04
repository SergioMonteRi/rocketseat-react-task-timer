import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextType {
  cycles: Cycle[]
  minutes: string
  seconds: string
  activeCycleId: string | null
  activeCycle: Cycle | undefined
  handleInterruptCycle: () => void
  handleCreateNewCycle: (data: CreateCycleData) => void
}

const CyclesContex = createContext({} as CycleContextType)

export function CycleContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsElapsed, setAmountSecondsElapsed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsElapsed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  const handleCreateNewCycle = (data: CreateCycleData) => {
    const newCycle: Cycle = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsElapsed(0)
  }

  const handleInterruptCycle = () => {
    dispatch(interruptCurrentCycleAction())
  }

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          dispatch(markCurrentCycleAsFinishedAction())

          setAmountSecondsElapsed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsElapsed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, cycles, totalSeconds])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  return (
    <CyclesContex.Provider
      value={{
        cycles,
        minutes,
        seconds,
        activeCycle,
        activeCycleId,
        handleCreateNewCycle,
        handleInterruptCycle,
      }}
    >
      {children}
    </CyclesContex.Provider>
  )
}

export const useCycleContext = () => {
  const context = useContext(CyclesContex)

  if (!context) {
    throw new Error(
      'useCycleContext must be used within a CycleContextProvider',
    )
  }

  return context
}
