import { HandPalm, Play } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'

import {
  HomeContainer,
  StopCountdownButton,
  StartCountdownButton,
} from './styles'

import { useCycleContext } from '../../contexts/cycleContext'

import { newCycleFormValidationSchema } from './schemaValidator'

import { NewCycleFormData } from './types'

export const Home = () => {
  const { activeCycle, handleCreateNewCycle, handleInterruptCycle } =
    useCycleContext()

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const onCreateNewCycle = (data: NewCycleFormData) => {
    handleCreateNewCycle(data)

    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(onCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Comecar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
