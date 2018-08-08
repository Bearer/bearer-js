/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import { RootComponent } from '@bearer/core'
import '@bearer/ui'

@RootComponent({
  name: 'display',
  group: '{{groupName}}'
})
export class {{groupName}}Display {
  render() {
    return (null)
  }
}
