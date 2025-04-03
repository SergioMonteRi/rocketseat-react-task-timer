import * as zod from 'zod'

import { newCycleFormValidationSchema } from './schemaValidator'

export type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export type Cycle = {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}
