import { differenceInSeconds } from 'date-fns'
import { createContext, useContext, useEffect, useState } from 'react'

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

export function CycleContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsElapsed, setAmountSecondsElapsed] = useState(0)

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

    setCycles((prevCycles) => [...prevCycles, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsElapsed(0)
  }

  const handleInterruptCycle = () => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
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
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

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
