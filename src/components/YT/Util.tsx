import { YouTube } from './types'

function isGuideCollapsibleEntryRenderer (
  guideEntryRenderer: YouTube.GuideEntryRenderer | YouTube.GuideCollapsibleEntryRenderer<YouTube.GuideEntryRenderer>,
): guideEntryRenderer is YouTube.GuideCollapsibleEntryRenderer<YouTube.SubscriptionGuideEntryRenderer> {
  return Object.prototype.hasOwnProperty.call(guideEntryRenderer, 'guideCollapsibleEntryRenderer')
}

function isSubscriptionGuideSectionRenderer (
  sectionGuideRenderer: YouTube.GuideSectionRenderer | YouTube.SubscriptionsGuideSectionRenderer,
): sectionGuideRenderer is YouTube.SubscriptionsGuideSectionRenderer {
  return Object.prototype.hasOwnProperty.call(sectionGuideRenderer, 'guideSubscriptionsSectionRenderer')
}

function isSubscriptionGuideEntryRenderer (
  guideEntryRenderer: YouTube.GuideEntryRenderer | YouTube.GuideCollapsibleEntryRenderer<YouTube.GuideEntryRenderer>,
): guideEntryRenderer is YouTube.SubscriptionGuideEntryRenderer {
  return Object.prototype.hasOwnProperty.call(guideEntryRenderer, 'guideEntryRenderer')
}

export function findGuideRendererSubscriptions (ytInitialGuideData: YouTube.InitialGuideData): YouTube.SubscriptionGuideEntryRenderer[] {
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
    .filter(gde => gde.guideEntryRenderer.icon === undefined)
}
