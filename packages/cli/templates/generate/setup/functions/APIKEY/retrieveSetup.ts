import { TAPIKEYAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/functions'

export default class RetrieveSetupFunction extends FetchData implements FetchData<ReturnedData, any, TAPIKEYAuthContext> {
  async action(event: TFetchActionEvent<Params, TAPIKEYAuthContext>): TFetchPromise<ReturnedData> {
    return { data: { referenceId: event.params.referenceId, ...event.context.reference } }
  }
}

export type Params = {
  setup: any
  referenceId: string
}

export type ReturnedData = {
  apiKey: string
  referenceId: string
}