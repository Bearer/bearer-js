import { TOAUTH1AuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
// import Client from './client'

export default class {{intentClassName}}Intent extends SaveState implements SaveState<State, ReturnedData, any, TOAUTH1AuthContext> {
  async action(event: TSaveActionEvent<State, Params, TOAUTH1AuthContext>): TSavePromise<State, ReturnedData> {
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