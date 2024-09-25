import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker: ReturnType<typeof setupWorker> = setupWorker(...handlers)