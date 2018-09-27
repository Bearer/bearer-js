/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
/* tslint:disable */

import '@stencil/core';


import {
  FWithAuthenticate,
  FWithRevoke,
} from './components/Authorized/bearer-authorized';
import {
  FieldSet,
} from './components/Forms/Fieldset';
import {
  TMember,
  TMemberRenderer,
} from './components/navigator/types';
import {
  TFetchBearerData,
} from '@bearer/core';
import {
  TCollectionRenderer,
} from './components/scrollable/types';


declare global {
  interface HTMLElement {
    componentOnReady?: () => Promise<this | null>;
  }

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}

  namespace StencilComponents {

    interface BearerAlert {
      'content': any;
      'kind': 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
      'onDismiss': () => void;
    }

    interface BearerAuthorized {
      'authenticate': () => void;
      'renderAuthorized': FWithRevoke;
      'renderUnauthorized': FWithAuthenticate;
      'revoke': (this: any) => void;
    }

    interface BearerCheckbox {
      'buttons': Array<{ label: string; value: string; checked?: boolean }>;
      'controlName': string;
      'inline': boolean;
      'label': string;
      'value': Array<string>;
    }

    interface BearerForm {
      'clearOnInput': boolean;
      'fields': FieldSet;
      'updateFieldSet': (fields: FieldSet) => void;
    }

    interface BearerInput {
      'controlName': string;
      'disabled': boolean;
      'hint': string;
      'label': string;
      'placeholder': string;
      'type': string;
      'value': string;
    }

    interface BearerRadio {
      'buttons': Array<{ label: string; value: string; checked?: boolean }>;
      'controlName': string;
      'inline': boolean;
      'label': string;
      'value': string;
    }

    interface BearerSelect {
      'controlName': string;
      'label': string;
      'options': Array<{ label: string; value: string; default?: boolean }>;
      'value': string;
    }

    interface BearerTextarea {
      'controlName': string;
      'hint': string;
      'label': string;
      'placeholder': string;
      'value': string;
    }

    interface BearerLoading {

    }

    interface BearerTypography {
      'as': string;
      'kind': ''
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'text-muted'
    | 'display-1'
    | 'display-2'
    | 'display-3'
    | 'display-4';
    }

    interface AuthConfig {

    }

    interface BearerBadge {
      'content': any;
      'kind': 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    }

    interface BearerButtonPopover {
      'arrow': boolean;
      'backNav': boolean;
      'btnProps': JSXElements.BearerButtonAttributes;
      'direction': string;
      'header': string;
      'opened': boolean;
      'toggle': (opened: boolean) => void;
    }

    interface BearerButton {
      'as': string;
      'content': any;
      'disabled': boolean;
      'kind': 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
      'size': 'md' | 'sm' | 'lg';
    }

    interface BearerConfigDisplay {
      'scenarioId': string;
    }

    interface BearerConfig {
      'fields': Array<any> | string;
      'referenceId': string;
      'scenarioId': string;
    }

    interface BearerDropdownButton {
      'btnProps': JSXElements.BearerButtonAttributes;
      'innerListener': string;
      'opened': boolean;
      'toggle': (opened: boolean) => void;
    }

    interface BearerNavigatorAuthScreen {
      'getTitle': () => string;
      'willAppear': () => void;
      'willDisappear': () => void;
    }

    interface BearerNavigatorBack {
      'disabled': boolean;
    }

    interface BearerNavigatorCollection {
      'data': any;
      'displayMemberProp': string;
      'renderFunc': TMemberRenderer<TMember>;
    }

    interface BearerNavigatorScreen {
      'getTitle': () => string;
      'name': string;
      'navigationTitle': ((data: any) => string) | string;
      'renderFunc': <T>(
    params: {
      next: (data: any) => void
      prev: () => void
      complete: () => void
      data: T
    }
  ) => void;
      'willAppear': (data: any) => void;
      'willDisappear': () => void;
    }

    interface BearerNavigator {
      'btnProps': JSXElements.BearerButtonAttributes;
      'complete': <T>({ data, complete }: { data: T; complete: () => void }) => void;
      'direction': string;
      'display': string;
    }

    interface BearerPagination {
      'currentPage': number;
      'displayNextPrev': boolean;
      'displayPages': boolean;
      'hasNext': boolean;
      'pageCount': number;
      'window': number;
    }

    interface BearerPaginator {
      'fetcher': (refineParams: { page: number }) => Promise<TFetchBearerData>;
      'pageCount': number;
      'perPage': number;
      'renderCollection': (collection: Array<any>) => any;
      'renderFetching': () => any;
      'reset': () => void;
    }

    interface BearerScrollable {
      'fetcher': ({ page: number }) => Promise<TFetchBearerData>;
      'perPage': number;
      'renderCollection': TCollectionRenderer;
      'renderFetching': () => any;
      'rendererProps': JSXElements.BearerNavigatorCollectionAttributes;
      'reset': () => void;
    }

    interface BearerSetupDisplay {
      'scenarioId': string;
      'setupId': string;
    }

    interface BearerSetup {
      'fields': Array<any> | string;
      'referenceId': string;
      'scenarioId': string;
    }
  }


    interface HTMLBearerAlertElement extends StencilComponents.BearerAlert, HTMLStencilElement {}

    var HTMLBearerAlertElement: {
      prototype: HTMLBearerAlertElement;
      new (): HTMLBearerAlertElement;
    };
    

    interface HTMLBearerAuthorizedElement extends StencilComponents.BearerAuthorized, HTMLStencilElement {}

    var HTMLBearerAuthorizedElement: {
      prototype: HTMLBearerAuthorizedElement;
      new (): HTMLBearerAuthorizedElement;
    };
    

    interface HTMLBearerCheckboxElement extends StencilComponents.BearerCheckbox, HTMLStencilElement {}

    var HTMLBearerCheckboxElement: {
      prototype: HTMLBearerCheckboxElement;
      new (): HTMLBearerCheckboxElement;
    };
    

    interface HTMLBearerFormElement extends StencilComponents.BearerForm, HTMLStencilElement {}

    var HTMLBearerFormElement: {
      prototype: HTMLBearerFormElement;
      new (): HTMLBearerFormElement;
    };
    

    interface HTMLBearerInputElement extends StencilComponents.BearerInput, HTMLStencilElement {}

    var HTMLBearerInputElement: {
      prototype: HTMLBearerInputElement;
      new (): HTMLBearerInputElement;
    };
    

    interface HTMLBearerRadioElement extends StencilComponents.BearerRadio, HTMLStencilElement {}

    var HTMLBearerRadioElement: {
      prototype: HTMLBearerRadioElement;
      new (): HTMLBearerRadioElement;
    };
    

    interface HTMLBearerSelectElement extends StencilComponents.BearerSelect, HTMLStencilElement {}

    var HTMLBearerSelectElement: {
      prototype: HTMLBearerSelectElement;
      new (): HTMLBearerSelectElement;
    };
    

    interface HTMLBearerTextareaElement extends StencilComponents.BearerTextarea, HTMLStencilElement {}

    var HTMLBearerTextareaElement: {
      prototype: HTMLBearerTextareaElement;
      new (): HTMLBearerTextareaElement;
    };
    

    interface HTMLBearerLoadingElement extends StencilComponents.BearerLoading, HTMLStencilElement {}

    var HTMLBearerLoadingElement: {
      prototype: HTMLBearerLoadingElement;
      new (): HTMLBearerLoadingElement;
    };
    

    interface HTMLBearerTypographyElement extends StencilComponents.BearerTypography, HTMLStencilElement {}

    var HTMLBearerTypographyElement: {
      prototype: HTMLBearerTypographyElement;
      new (): HTMLBearerTypographyElement;
    };
    

    interface HTMLAuthConfigElement extends StencilComponents.AuthConfig, HTMLStencilElement {}

    var HTMLAuthConfigElement: {
      prototype: HTMLAuthConfigElement;
      new (): HTMLAuthConfigElement;
    };
    

    interface HTMLBearerBadgeElement extends StencilComponents.BearerBadge, HTMLStencilElement {}

    var HTMLBearerBadgeElement: {
      prototype: HTMLBearerBadgeElement;
      new (): HTMLBearerBadgeElement;
    };
    

    interface HTMLBearerButtonPopoverElement extends StencilComponents.BearerButtonPopover, HTMLStencilElement {}

    var HTMLBearerButtonPopoverElement: {
      prototype: HTMLBearerButtonPopoverElement;
      new (): HTMLBearerButtonPopoverElement;
    };
    

    interface HTMLBearerButtonElement extends StencilComponents.BearerButton, HTMLStencilElement {}

    var HTMLBearerButtonElement: {
      prototype: HTMLBearerButtonElement;
      new (): HTMLBearerButtonElement;
    };
    

    interface HTMLBearerConfigDisplayElement extends StencilComponents.BearerConfigDisplay, HTMLStencilElement {}

    var HTMLBearerConfigDisplayElement: {
      prototype: HTMLBearerConfigDisplayElement;
      new (): HTMLBearerConfigDisplayElement;
    };
    

    interface HTMLBearerConfigElement extends StencilComponents.BearerConfig, HTMLStencilElement {}

    var HTMLBearerConfigElement: {
      prototype: HTMLBearerConfigElement;
      new (): HTMLBearerConfigElement;
    };
    

    interface HTMLBearerDropdownButtonElement extends StencilComponents.BearerDropdownButton, HTMLStencilElement {}

    var HTMLBearerDropdownButtonElement: {
      prototype: HTMLBearerDropdownButtonElement;
      new (): HTMLBearerDropdownButtonElement;
    };
    

    interface HTMLBearerNavigatorAuthScreenElement extends StencilComponents.BearerNavigatorAuthScreen, HTMLStencilElement {}

    var HTMLBearerNavigatorAuthScreenElement: {
      prototype: HTMLBearerNavigatorAuthScreenElement;
      new (): HTMLBearerNavigatorAuthScreenElement;
    };
    

    interface HTMLBearerNavigatorBackElement extends StencilComponents.BearerNavigatorBack, HTMLStencilElement {}

    var HTMLBearerNavigatorBackElement: {
      prototype: HTMLBearerNavigatorBackElement;
      new (): HTMLBearerNavigatorBackElement;
    };
    

    interface HTMLBearerNavigatorCollectionElement extends StencilComponents.BearerNavigatorCollection, HTMLStencilElement {}

    var HTMLBearerNavigatorCollectionElement: {
      prototype: HTMLBearerNavigatorCollectionElement;
      new (): HTMLBearerNavigatorCollectionElement;
    };
    

    interface HTMLBearerNavigatorScreenElement extends StencilComponents.BearerNavigatorScreen, HTMLStencilElement {}

    var HTMLBearerNavigatorScreenElement: {
      prototype: HTMLBearerNavigatorScreenElement;
      new (): HTMLBearerNavigatorScreenElement;
    };
    

    interface HTMLBearerNavigatorElement extends StencilComponents.BearerNavigator, HTMLStencilElement {}

    var HTMLBearerNavigatorElement: {
      prototype: HTMLBearerNavigatorElement;
      new (): HTMLBearerNavigatorElement;
    };
    

    interface HTMLBearerPaginationElement extends StencilComponents.BearerPagination, HTMLStencilElement {}

    var HTMLBearerPaginationElement: {
      prototype: HTMLBearerPaginationElement;
      new (): HTMLBearerPaginationElement;
    };
    

    interface HTMLBearerPaginatorElement extends StencilComponents.BearerPaginator, HTMLStencilElement {}

    var HTMLBearerPaginatorElement: {
      prototype: HTMLBearerPaginatorElement;
      new (): HTMLBearerPaginatorElement;
    };
    

    interface HTMLBearerScrollableElement extends StencilComponents.BearerScrollable, HTMLStencilElement {}

    var HTMLBearerScrollableElement: {
      prototype: HTMLBearerScrollableElement;
      new (): HTMLBearerScrollableElement;
    };
    

    interface HTMLBearerSetupDisplayElement extends StencilComponents.BearerSetupDisplay, HTMLStencilElement {}

    var HTMLBearerSetupDisplayElement: {
      prototype: HTMLBearerSetupDisplayElement;
      new (): HTMLBearerSetupDisplayElement;
    };
    

    interface HTMLBearerSetupElement extends StencilComponents.BearerSetup, HTMLStencilElement {}

    var HTMLBearerSetupElement: {
      prototype: HTMLBearerSetupElement;
      new (): HTMLBearerSetupElement;
    };
    

  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {
    'bearer-alert': JSXElements.BearerAlertAttributes;
    'bearer-authorized': JSXElements.BearerAuthorizedAttributes;
    'bearer-checkbox': JSXElements.BearerCheckboxAttributes;
    'bearer-form': JSXElements.BearerFormAttributes;
    'bearer-input': JSXElements.BearerInputAttributes;
    'bearer-radio': JSXElements.BearerRadioAttributes;
    'bearer-select': JSXElements.BearerSelectAttributes;
    'bearer-textarea': JSXElements.BearerTextareaAttributes;
    'bearer-loading': JSXElements.BearerLoadingAttributes;
    'bearer-typography': JSXElements.BearerTypographyAttributes;
    'auth-config': JSXElements.AuthConfigAttributes;
    'bearer-badge': JSXElements.BearerBadgeAttributes;
    'bearer-button-popover': JSXElements.BearerButtonPopoverAttributes;
    'bearer-button': JSXElements.BearerButtonAttributes;
    'bearer-config-display': JSXElements.BearerConfigDisplayAttributes;
    'bearer-config': JSXElements.BearerConfigAttributes;
    'bearer-dropdown-button': JSXElements.BearerDropdownButtonAttributes;
    'bearer-navigator-auth-screen': JSXElements.BearerNavigatorAuthScreenAttributes;
    'bearer-navigator-back': JSXElements.BearerNavigatorBackAttributes;
    'bearer-navigator-collection': JSXElements.BearerNavigatorCollectionAttributes;
    'bearer-navigator-screen': JSXElements.BearerNavigatorScreenAttributes;
    'bearer-navigator': JSXElements.BearerNavigatorAttributes;
    'bearer-pagination': JSXElements.BearerPaginationAttributes;
    'bearer-paginator': JSXElements.BearerPaginatorAttributes;
    'bearer-scrollable': JSXElements.BearerScrollableAttributes;
    'bearer-setup-display': JSXElements.BearerSetupDisplayAttributes;
    'bearer-setup': JSXElements.BearerSetupAttributes;
    }
  }

  namespace JSXElements {

    export interface BearerAlertAttributes extends HTMLAttributes {
      'content'?: any;
      'kind'?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
      'onDismiss'?: () => void;
    }

    export interface BearerAuthorizedAttributes extends HTMLAttributes {
      'renderAuthorized'?: FWithRevoke;
      'renderUnauthorized'?: FWithAuthenticate;
    }

    export interface BearerCheckboxAttributes extends HTMLAttributes {
      'buttons'?: Array<{ label: string; value: string; checked?: boolean }>;
      'controlName'?: string;
      'inline'?: boolean;
      'label'?: string;
      'onValueChange'?: (event: CustomEvent) => void;
      'value'?: Array<string>;
    }

    export interface BearerFormAttributes extends HTMLAttributes {
      'clearOnInput'?: boolean;
      'fields'?: FieldSet;
      'onSubmit'?: (event: CustomEvent) => void;
    }

    export interface BearerInputAttributes extends HTMLAttributes {
      'controlName'?: string;
      'disabled'?: boolean;
      'hint'?: string;
      'label'?: string;
      'onInputClick'?: (event: CustomEvent) => void;
      'onSubmit'?: (event: CustomEvent) => void;
      'onValueChange'?: (event: CustomEvent) => void;
      'placeholder'?: string;
      'type'?: string;
      'value'?: string;
    }

    export interface BearerRadioAttributes extends HTMLAttributes {
      'buttons'?: Array<{ label: string; value: string; checked?: boolean }>;
      'controlName'?: string;
      'inline'?: boolean;
      'label'?: string;
      'onValueChange'?: (event: CustomEvent) => void;
      'value'?: string;
    }

    export interface BearerSelectAttributes extends HTMLAttributes {
      'controlName'?: string;
      'label'?: string;
      'onValueChange'?: (event: CustomEvent) => void;
      'options'?: Array<{ label: string; value: string; default?: boolean }>;
      'value'?: string;
    }

    export interface BearerTextareaAttributes extends HTMLAttributes {
      'controlName'?: string;
      'hint'?: string;
      'label'?: string;
      'onValueChange'?: (event: CustomEvent) => void;
      'placeholder'?: string;
      'value'?: string;
    }

    export interface BearerLoadingAttributes extends HTMLAttributes {

    }

    export interface BearerTypographyAttributes extends HTMLAttributes {
      'as'?: string;
      'kind'?: ''
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'text-muted'
    | 'display-1'
    | 'display-2'
    | 'display-3'
    | 'display-4';
    }

    export interface AuthConfigAttributes extends HTMLAttributes {
      'onSubmit'?: (event: CustomEvent) => void;
    }

    export interface BearerBadgeAttributes extends HTMLAttributes {
      'content'?: any;
      'kind'?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    }

    export interface BearerButtonPopoverAttributes extends HTMLAttributes {
      'arrow'?: boolean;
      'backNav'?: boolean;
      'btnProps'?: JSXElements.BearerButtonAttributes;
      'direction'?: string;
      'header'?: string;
      'onVisibilityChange'?: (event: CustomEvent) => void;
      'opened'?: boolean;
    }

    export interface BearerButtonAttributes extends HTMLAttributes {
      'as'?: string;
      'content'?: any;
      'disabled'?: boolean;
      'kind'?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
      'size'?: 'md' | 'sm' | 'lg';
    }

    export interface BearerConfigDisplayAttributes extends HTMLAttributes {
      'scenarioId'?: string;
    }

    export interface BearerConfigAttributes extends HTMLAttributes {
      'fields'?: Array<any> | string;
      'onStepCompleted'?: (event: CustomEvent) => void;
      'referenceId'?: string;
      'scenarioId'?: string;
    }

    export interface BearerDropdownButtonAttributes extends HTMLAttributes {
      'btnProps'?: JSXElements.BearerButtonAttributes;
      'innerListener'?: string;
      'opened'?: boolean;
    }

    export interface BearerNavigatorAuthScreenAttributes extends HTMLAttributes {
      'onScenarioAuthenticate'?: (event: CustomEvent) => void;
      'onStepCompleted'?: (event: CustomEvent) => void;
    }

    export interface BearerNavigatorBackAttributes extends HTMLAttributes {
      'disabled'?: boolean;
      'onNavigatorGoBack'?: (event: CustomEvent) => void;
    }

    export interface BearerNavigatorCollectionAttributes extends HTMLAttributes {
      'data'?: any;
      'displayMemberProp'?: string;
      'onCompleteScreen'?: (event: CustomEvent) => void;
      'renderFunc'?: TMemberRenderer<TMember>;
    }

    export interface BearerNavigatorScreenAttributes extends HTMLAttributes {
      'name'?: string;
      'navigationTitle'?: ((data: any) => string) | string;
      'onNavigatorGoBack'?: (event: CustomEvent) => void;
      'onScenarioCompleted'?: (event: CustomEvent) => void;
      'onStepCompleted'?: (event: CustomEvent) => void;
      'renderFunc'?: <T>(
    params: {
      next: (data: any) => void
      prev: () => void
      complete: () => void
      data: T
    }
  ) => void;
    }

    export interface BearerNavigatorAttributes extends HTMLAttributes {
      'btnProps'?: JSXElements.BearerButtonAttributes;
      'complete'?: <T>({ data, complete }: { data: T; complete: () => void }) => void;
      'direction'?: string;
      'display'?: string;
    }

    export interface BearerPaginationAttributes extends HTMLAttributes {
      'currentPage'?: number;
      'displayNextPrev'?: boolean;
      'displayPages'?: boolean;
      'hasNext'?: boolean;
      'onBearerPaginationGoTo'?: (event: CustomEvent) => void;
      'onBearerPaginationNext'?: (event: CustomEvent) => void;
      'onBearerPaginationPrev'?: (event: CustomEvent) => void;
      'pageCount'?: number;
      'window'?: number;
    }

    export interface BearerPaginatorAttributes extends HTMLAttributes {
      'fetcher'?: (refineParams: { page: number }) => Promise<TFetchBearerData>;
      'pageCount'?: number;
      'perPage'?: number;
      'renderCollection'?: (collection: Array<any>) => any;
      'renderFetching'?: () => any;
    }

    export interface BearerScrollableAttributes extends HTMLAttributes {
      'fetcher'?: ({ page: number }) => Promise<TFetchBearerData>;
      'perPage'?: number;
      'renderCollection'?: TCollectionRenderer;
      'renderFetching'?: () => any;
      'rendererProps'?: JSXElements.BearerNavigatorCollectionAttributes;
    }

    export interface BearerSetupDisplayAttributes extends HTMLAttributes {
      'scenarioId'?: string;
      'setupId'?: string;
    }

    export interface BearerSetupAttributes extends HTMLAttributes {
      'fields'?: Array<any> | string;
      'onSetupSuccess'?: (event: CustomEvent) => void;
      'referenceId'?: string;
      'scenarioId'?: string;
    }
  }

  interface HTMLElementTagNameMap {
    'bearer-alert': HTMLBearerAlertElement
    'bearer-authorized': HTMLBearerAuthorizedElement
    'bearer-checkbox': HTMLBearerCheckboxElement
    'bearer-form': HTMLBearerFormElement
    'bearer-input': HTMLBearerInputElement
    'bearer-radio': HTMLBearerRadioElement
    'bearer-select': HTMLBearerSelectElement
    'bearer-textarea': HTMLBearerTextareaElement
    'bearer-loading': HTMLBearerLoadingElement
    'bearer-typography': HTMLBearerTypographyElement
    'auth-config': HTMLAuthConfigElement
    'bearer-badge': HTMLBearerBadgeElement
    'bearer-button-popover': HTMLBearerButtonPopoverElement
    'bearer-button': HTMLBearerButtonElement
    'bearer-config-display': HTMLBearerConfigDisplayElement
    'bearer-config': HTMLBearerConfigElement
    'bearer-dropdown-button': HTMLBearerDropdownButtonElement
    'bearer-navigator-auth-screen': HTMLBearerNavigatorAuthScreenElement
    'bearer-navigator-back': HTMLBearerNavigatorBackElement
    'bearer-navigator-collection': HTMLBearerNavigatorCollectionElement
    'bearer-navigator-screen': HTMLBearerNavigatorScreenElement
    'bearer-navigator': HTMLBearerNavigatorElement
    'bearer-pagination': HTMLBearerPaginationElement
    'bearer-paginator': HTMLBearerPaginatorElement
    'bearer-scrollable': HTMLBearerScrollableElement
    'bearer-setup-display': HTMLBearerSetupDisplayElement
    'bearer-setup': HTMLBearerSetupElement
  }

  interface ElementTagNameMap {
    'bearer-alert': HTMLBearerAlertElement;
    'bearer-authorized': HTMLBearerAuthorizedElement;
    'bearer-checkbox': HTMLBearerCheckboxElement;
    'bearer-form': HTMLBearerFormElement;
    'bearer-input': HTMLBearerInputElement;
    'bearer-radio': HTMLBearerRadioElement;
    'bearer-select': HTMLBearerSelectElement;
    'bearer-textarea': HTMLBearerTextareaElement;
    'bearer-loading': HTMLBearerLoadingElement;
    'bearer-typography': HTMLBearerTypographyElement;
    'auth-config': HTMLAuthConfigElement;
    'bearer-badge': HTMLBearerBadgeElement;
    'bearer-button-popover': HTMLBearerButtonPopoverElement;
    'bearer-button': HTMLBearerButtonElement;
    'bearer-config-display': HTMLBearerConfigDisplayElement;
    'bearer-config': HTMLBearerConfigElement;
    'bearer-dropdown-button': HTMLBearerDropdownButtonElement;
    'bearer-navigator-auth-screen': HTMLBearerNavigatorAuthScreenElement;
    'bearer-navigator-back': HTMLBearerNavigatorBackElement;
    'bearer-navigator-collection': HTMLBearerNavigatorCollectionElement;
    'bearer-navigator-screen': HTMLBearerNavigatorScreenElement;
    'bearer-navigator': HTMLBearerNavigatorElement;
    'bearer-pagination': HTMLBearerPaginationElement;
    'bearer-paginator': HTMLBearerPaginatorElement;
    'bearer-scrollable': HTMLBearerScrollableElement;
    'bearer-setup-display': HTMLBearerSetupDisplayElement;
    'bearer-setup': HTMLBearerSetupElement;
  }
}
declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;