import * as zod from 'zod'

export const newCycleFormValidationSchema = zod.object({
  task: zod
    .string()
    .nonempty({ message: 'A tarefa não pode ser vazia' })
    .min(1, { message: 'A tarefa deve ter pelo menos 1 caractere' }),
  minutesAmount: zod
    .number()
    .min(5, { message: 'O tempo mínimo é de 5 minutos' })
    .max(60, { message: 'O tempo máximo é de 60 minutos' }),
})
