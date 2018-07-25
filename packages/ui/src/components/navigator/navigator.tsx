import { Component, Element, Listen, Prop, State, Watch } from '@bearer/core'

const NAVIGATOR_AUTH_SCREEN_NAME = 'BEARER-NAVIGATOR-AUTH-SCREEN'

@Component({
  tag: 'bearer-navigator',
  shadow: true
})
export class BearerPopoverNavigator {
  @Element() el: HTMLElement
  @State() screens: Array<any> = []
  @State() screenData: Object = {}
  @State() isVisible: boolean = false
  @State() _visibleScreenIndex: number
  @State() navigationTitle: string

  @Prop() direction: string = 'right'
  @Prop() btnProps: JSXElements.BearerButtonAttributes = { content: 'Activate' }
  @Prop() display = 'popover'

  @Listen('scenarioCompleted')
  scenarioCompletedHandler() {
    this.screenData = {}
    this.visibleScreen = this.hasAuthScreen() ? 1 : 0
    this.el.shadowRoot.querySelector('#button')['toggle'](false)
  }

  @Listen('stepCompleted')
  stepCompletedHandler(event) {
    event.preventDefault()
    event.stopImmediatePropagation()
    this.screenData = {
      ...this.screenData,
      ...event.detail
    }
    this.next(null)
  }

  next = e => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (this.hasNext()) {
      this.visibleScreen = Math.min(this._visibleScreenIndex + 1, this.screens.length - 1)
    }
  }

  @Listen('navigatorGoBack')
  prev(e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (this.hasPrevious()) {
      this.visibleScreen = Math.max(this._visibleScreenIndex - 1, 0)
    }
  }

  @Watch('isVisible')
  visibilityChangeHandler(newValue: boolean) {
    // becomes visible
    if (newValue) {
      this.showScreen(this.visibleScreen)
    } else {
      // this.hideScreen(this.visibleScreen)
    }
  }

  set visibleScreen(index) {
    if (this._visibleScreenIndex >= 0) {
      this.hideScreen(this.visibleScreen)
    }
    this._visibleScreenIndex = index
    this.showScreen(this.visibleScreen)
  }

  get visibleScreen(): any {
    return this.screens[this._visibleScreenIndex]
  }

  get screenNodes() {
    return this.el.shadowRoot
      ? this.el.shadowRoot
          .querySelector('slot:not([name])')
          ['assignedNodes']()
          .filter(node => node.willAppear)
      : []
  }

  onVisibilityChange = ({ detail: { visible } }: { detail: { visible: boolean } }) => {
    this.isVisible = visible
  }

  showScreen = screen => {
    if (screen && this.isVisible) {
      screen.willAppear(this.screenData)
      this.navigationTitle = screen.getTitle()
      screen.classList.add('in')
    }
  }

  hideScreen = screen => {
    if (screen) {
      screen.willDisappear()
      screen.classList.remove('in')
    }
  }

  hasNext = () => this._visibleScreenIndex < this.screens.length - 1
  hasPrevious = () => this._visibleScreenIndex > 0
  hasAuthScreen = () => this.screenNodes.filter(node => node['tagName'] === NAVIGATOR_AUTH_SCREEN_NAME).length

  componentDidLoad() {
    this.screens = this.screenNodes
    this._visibleScreenIndex = 0
  }

  render() {
    return (
      <bearer-button-popover
        btnProps={this.btnProps}
        id="button"
        direction={this.direction}
        header={this.navigationTitle}
        backNav={this.hasPrevious()}
        onVisibilityChange={this.onVisibilityChange}
      >
        <slot />
      </bearer-button-popover>
    )
  }
}
