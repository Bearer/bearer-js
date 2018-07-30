/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import { Component } from '@bearer/core'
import '@bearer/ui'

@Component({
  name: 'action',
  action: '{{componentName}}'
})
export class {{componentName}}Action {
  render() {
    return (
      <div>
        <bearer-navigator btnProps={ {content:"Scenario Name", kind:"primary"} } direction="right">
          <bearer-navigator-auth-screen />
        </bearer-navigator>
      </div>
    )
  }
}
