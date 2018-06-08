import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  Watch
} from '@stencil/core'

@Component({
  tag: 'bearer-input',
  styleUrl: './Input.scss',
  shadow: true
})
export class BearerInput {
  @Element() el: HTMLElement
  @Prop() label?: string
  @Prop() type: string
  // | 'text'
  // | 'password'
  // | 'email'
  // | 'submit'
  @Prop() controlName: string
  @Prop() placeholder: string
  @Prop({ mutable: true })
  value: string
  @Prop({ mutable: true })
  hint: string
  @Event() valueChange: EventEmitter
  @Event() submit: EventEmitter

  @Watch('value')
  valueChanged() {
    const inputEl = this.el.shadowRoot.querySelector('input')
    if (inputEl.value !== this.value) {
      inputEl.value = this.value
    }
  }

  inputChanged(event: any) {
    let val = event.target && event.target.value
    this.value = val
    this.valueChange.emit(this.value)
  }

  inputClicked() {
    if (this.type === 'submit') {
      this.submit.emit('submit')
    }
  }

  render() {
    return (
      <div class="form-group">
        {this.label ? <label>{this.label}</label> : ''}
        <input
          type={this.type}
          name={this.controlName}
          value={this.value}
          placeholder={this.placeholder}
          class={this.type === 'submit' ? 'btn btn-primary' : 'form-control'}
          onInput={this.inputChanged.bind(this)}
          onClick={this.inputClicked.bind(this)}
        />
        {this.hint ? (
          <small class="form-text text-muted">{this.hint}</small>
        ) : (
          ''
        )}
      </div>
    )
  }
}
