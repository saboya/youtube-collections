import * as Preact from 'preact'
import * as Hooks from 'preact/hooks'
import { YouTube } from './index'
import { JSXInternal } from 'preact/src/jsx'

type Unpacked<T> = T extends Array<infer U> ? U : T;

function isGuideCollapsibleEntryRenderer (
  guideEntryRenderer: Unpacked<YouTube.SubscriptionsGuideSectionRenderer['guideSubscriptionsSectionRenderer']['items']>,
): guideEntryRenderer is YouTube.GuideCollapsibleEntryRenderer<YouTube.SubscriptionGuideEntryRenderer> {
  return Object.prototype.hasOwnProperty.call(guideEntryRenderer, 'guideCollapsibleEntryRenderer')
}

function isSubscriptionGuideSectionRenderer (
  sectionGuideRenderer: Unpacked<typeof window.ytInitialGuideData.items>,
): sectionGuideRenderer is YouTube.SubscriptionsGuideSectionRenderer {
  return Object.prototype.hasOwnProperty.call(sectionGuideRenderer, 'guideSubscriptionsSectionRenderer')
}

function isSubscriptionGuideEntryRenderer (
  guideEntryRenderer: Unpacked<YouTube.SubscriptionsGuideSectionRenderer['guideSubscriptionsSectionRenderer']['items']>,
): guideEntryRenderer is YouTube.SubscriptionGuideEntryRenderer {
  return Object.prototype.hasOwnProperty.call(guideEntryRenderer, 'guideEntryRenderer')
}

export function findSubscriptions (ytInitialGuideData: YouTube.InitialGuideData): YouTube.SubscriptionGuideEntryRenderer[] {
  const subscriptionGuideSectionRenderer = ytInitialGuideData.items.find(isSubscriptionGuideSectionRenderer)

  if (subscriptionGuideSectionRenderer === undefined) {
    return []
  }

  return subscriptionGuideSectionRenderer.guideSubscriptionsSectionRenderer.items
    .filter(isSubscriptionGuideEntryRenderer)
    .concat(subscriptionGuideSectionRenderer.guideSubscriptionsSectionRenderer.items
      .filter(isGuideCollapsibleEntryRenderer)
      .flatMap(e => e.guideCollapsibleEntryRenderer.expandableItems),
    )
}

export const clearFirst = <T extends JSXInternal.HTMLAttributes<SVGElement>>(WrappedComponent: Preact.ComponentType<T>) => {
  return (props: T) => {
    const elementRef = Hooks.useRef<HTMLElement>(null)
    const [refCleared, setRefCleared] = Hooks.useState(false)

    Hooks.useLayoutEffect(() => {
      if (elementRef.current !== null) {
        elementRef.current.innerHTML = ''
        setRefCleared(true)
      }
    }, [])

    const { children, ...propsWithoutChildren } = props

    const childrenToRender = Hooks.useMemo(() => refCleared ? children : null, [children, refCleared])

    return Preact.createElement(
      WrappedComponent,
      {
        ...propsWithoutChildren as T,
        ref: elementRef,
      },
      childrenToRender,
    )
  }
}
