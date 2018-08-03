import { RootComponent, Intent, BearerFetch, IntentType, BearerState } from '@bearer/core'

@RootComponent({
  group: 'attach-pull-request',
  name: 'display'
})
export class AttachPullRequestDisplay {
  @Intent('ListRepositories') fetcher: BearerFetch
  @RetrieveStateIntent() retrieve: BearerFetch
  @BearerState() attachedPullRequests: Array<any>
  @BearerState({ statePropName: 'goats' })
  ducks: Array<any>
  @Intent('getPullRequest', IntentType.GetResource)
  fetchResource: BearerFetch

  render() {
    return <bearer-scrollable fetcher={this.fetcher} />
  }
}