import { Component, Prop } from '@stencil/core'

@Component({
  tag: 'bearer-badge',
  styleUrl: './Badge.scss',
  shadow: true
})
export class BearerBadge {
  @Prop()
  kind:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'

  render() {
    return (
      <span class={`badge badge-${this.kind}`}>
        <slot />
      </span>
    )
  }
}
