import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

export type Cycle = {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
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

type CyclesState = {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CycleContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      console.log(action)
      console.log(state)

      if (action.type === 'ADD_NEW_CYCLE') {
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        }
      }

      if (action.type === 'INTERRUPT_CURRENT_CYCLE') {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return { ...cycle, interruptedDate: new Date() }
            } else {
              return cycle
            }
          }),
          activeCycleId: null,
        }
      }

      return state
    },
    { cycles: [], activeCycleId: null },
  )

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

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    // setCycles((prevCycles) => [...prevCycles, newCycle])

    setAmountSecondsElapsed(0)
  }

  const handleInterruptCycle = () => {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
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
          dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
              activeCycleId,
            },
          })

          // setCycles((state) =>
          //   state.map((cycle) => {
          //     if (cycle.id === activeCycleId) {
          //       return { ...cycle, finishedDate: new Date() }
          //     } else {
          //       return cycle
          //     }
          //   }),
          // )

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
