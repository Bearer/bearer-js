import { Component, Prop } from '@stencil/core'
import { classnames } from '@bearer/core'

@Component({
  tag: 'bearer-alert',
  styleUrl: 'Alert.scss',
  shadow: true
})
export class Alert {
  @Prop() onDismiss: () => void
  @Prop()
  kind:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark' = 'primary'

  render() {
    const classes = classnames({
      alert: true,
      [`alert-${this.kind}`]: true,
      'alert-dismissible': this.onDismiss
    })

    return (
      <div class={classes}>
        <slot />
        {this.onDismiss && (
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={this.onDismiss}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    )
  }
}