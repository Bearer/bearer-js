import { TBASICAuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
// import Client from './client'

export default class {{intentClassName}}Intent extends SaveState implements SaveState<State, ReturnedData, any, TBASICAuthContext> {
  async action(event: TSaveActionEvent<State, Params, TBASICAuthContext>): TSavePromise<State, ReturnedData> {
    // const { username, password } = event.context.authAccess
    // Put your logic here
    return { state: [], data: [] }
  }
}

/**
 * Typing
 */
export type Params = {
  // name: string
}

export type State = {
  // foo: string[]
}

export type ReturnedData = {
  // foo: string[]
}
