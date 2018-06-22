import {
  Component,
  State,
  Element,
  Event,
  EventEmitter,
  Prop
} from '@stencil/core'
import Bearer, { BearerState } from '@bearer/core'
import { FieldSet } from '../Forms/Fieldset'

interface ConfigSetupData {
  Item: {
    clientId: string
    referenceId: string
  }
}

@Component({
  tag: 'bearer-setup',
  styleUrl: 'setup.scss',
  shadow: true
})
export class BearerSetup {
  @Prop() fields: Array<any> = []
  @Prop() referenceId: string
  @Prop() scenarioId: string

  @Element() element: HTMLElement
  @Event() stepCompleted: EventEmitter

  @State() fieldSet: FieldSet
  @State() error: boolean = false
  @State() loading: boolean = false

  handleSubmit = (e: any) => {
    e.preventDefault()
    this.loading = true
    const secretSet = this.fieldSet.map(el => {
      return { key: el.controlName, value: el.value }
    })
    const publicSet = this.fieldSet
      .filter(el => el.type !== 'password')
      .map(el => {
        return { key: el.controlName, value: el.value }
      })
    console.log(
      secretSet,
      secretSet.reduce(
        (acc, obj) => ({ ...acc, [obj['key']]: obj['value'] }),
        {}
      ),
      publicSet.reduce(
        (acc, obj) => ({ ...acc, [obj['key']]: obj['value'] }),
        {}
      )
    )
    // we trick the system for the moment and we don't give a shit
    // the intentName is the reference ID
    BearerState.storeSecret(
      this.scenarioId,
      secretSet.reduce(
        (acc, obj) => ({ ...acc, [obj['key']]: obj['value'] }),
        {}
      )
    )
      .then(() => {
        this.error = false
        return BearerState.storeData(
          `${this.scenarioId}-setup`,
          publicSet.reduce(
            (acc, obj) => ({ ...acc, [obj['key']]: obj['value'] }),
            {}
          )
        )
      })
      .then((data: ConfigSetupData) => {
        this.loading = false
        Bearer.emitter.emit(`setup_success:${this.scenarioId}`, {
          // clientID: this.inputs.clientID,
          referenceID: data.Item.referenceId
        })
      })
      .catch(() => {
        this.error = true
        this.loading = false
        Bearer.emitter.emit(`setup_error:${this.scenarioId}`, {})
      })
  }

  handleValue(field, value) {
    this.fields[field] = value.detail
  }

  componentWillLoad() {
    this.fieldSet = new FieldSet(this.fields)
  }

  componentDidLoad() {
    const form = this.element.shadowRoot.querySelector('bearer-form')
    if (true || this.referenceId) {
      BearerState.getData(`${this.scenarioId}-setup`)
        .then((data: { Item: Object }) => {
          Object.keys(data.Item).forEach(key => {
            if (
              data.Item.hasOwnProperty(key) &&
              key !== 'ReadAllowed' &&
              key !== 'referenceId'
            ) {
              console.log(key, data.Item[key])
              this.fieldSet.setValue(key, data.Item[key])
            }
          })
          form.updateFieldSet(this.fieldSet)
          console.debug('[BEARER]', 'get_setup_success', data)
          Bearer.emitter.emit(`setup_success:${this.scenarioId}`, {
            referenceID: this.scenarioId
          })
        })
        .catch(e => {
          console.error('[BEARER]', 'get_setup_error', e)
        })
    }
  }

  render() {
    return (
      <div>
        {this.error && (
          <bearer-alert kind="danger">
            [Error] Unable to store the credentials
          </bearer-alert>
        )}
        {this.loading ? (
          <bearer-loading />
        ) : (
          <bearer-form
            fields={this.fieldSet}
            clearOnInput={true}
            onSubmit={this.handleSubmit}
          />
        )}
      </div>
    )
  }
}
