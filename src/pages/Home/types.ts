import * as zod from 'zod'

import { newCycleFormValidationSchema } from './schemaValidator'

export type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
