import DropDown from './DropDown'
import * as Guide from './Guide'

export module YouTube {
  enum SortCriteriaType {
    CHANNEL_RELEVANCE = 'CHANNEL_RELEVANCE'
  }

  enum IconType {
    EXPAND = 'EXPAND'
  }

  enum WebPageType {
    BROWSE = 'WEB_PAGE_TYPE_BROWSE'
  }

  enum GuideEntryPresentationStyle {
    NON = 'GUIDE_ENTRY_PRESENTATION_STYLE_NONE',
    NEW_CONTENT = 'GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT'
  }

  interface GuideEntryNavigationEndpoint {
    navigationEndpoint: {
      /**
       * Some YouTube internal tracking id
       */
      clickTrackingParams: string
    }
    browseEndpoint: {
      /**
       * For a subscription, it's the channel id. Example: "UC-_SoG6x0XvcQRgQEh7Ce9Q"
       * Full url for a channel: https://www.youtube.com/channel/UC-_SoG6x0XvcQRgQEh7Ce9Q
       */
      browseId: string
    }
    commandMetadata: {
      webCommandMetadata: {
        /**
         * For a subscription, it's the channel URL relative to the YouTube domain
         * Example: "/channel/UC-_SoG6x0XvcQRgQEh7Ce9Q"
         */
        url: string
        webPageType: WebPageType
        /**
         * No idea what this is
         */
        rootVe: number
      }
    }
  }

  interface GuideEntryThumbnail {
    /**
     * Apparently url is to a JPEG image
     */
    thumbnails: Array<{ url: string }>
    webThumbnailDetailsExtensionData: {
      /**
       * No idea what this is
       */
      excludeFromVpl: boolean
    }
  }

  interface GuideEntryAccessibility {
    accessibilityData: {
      /**
       * For a subscription, it's the same as the channel title
       */
      label: string
    }
  }

  interface GuideEntryBadgesType {
    liveBroadcasting: boolean
  }

  export interface GuideEntryRendererBaseProperties {
    title: string
    trackingParams: string
    formattedTitle: {
      simpleText: string
    }
    icon?: {
      iconType: IconType
    }
    accessibility?: GuideEntryAccessibility
    thumbnail?: GuideEntryThumbnail
    entryData: {
      /**
       * Example: "UCsQBsZJltmLzlsJNG7HevBg"
       */
      guideEntryData: string
    }
    navigationEndpoint: GuideEntryNavigationEndpoint
    presentationStyle: GuideEntryPresentationStyle
  }

  export interface GuideEntryRendererSubscriptionProperties extends GuideEntryRendererBaseProperties {
    badges: GuideEntryBadgesType
    thumbnail: GuideEntryThumbnail
  }

  export interface GuideEntryRenderer<T extends GuideEntryRendererBaseProperties = GuideEntryRendererBaseProperties> {
    guideEntryRenderer: T
  }

  export interface GuideCollapsibleEntryRenderer<T extends GuideEntryRenderer> {
    guideCollapsibleEntryRenderer: {
      expanderItem: GuideEntryRenderer
      expandableItems: T[]
      collapserItem: GuideEntryRenderer
    }
  }

  interface GuideSectionRendererProperties<T extends GuideEntryRenderer = GuideEntryRenderer> {
    title: string
    items: Array<T | GuideCollapsibleEntryRenderer<T>>
    trackingParams: string
    formattedTitle: { simpleText: string }
  }

  export interface GuideSectionRenderer {
    guideSectionRenderer: GuideSectionRendererProperties
  }

  export type SubscriptionGuideEntryRenderer = GuideEntryRenderer<GuideEntryRendererSubscriptionProperties>

  export interface YouTubeGuideSectionRendererProperties extends GuideSectionRendererProperties<SubscriptionGuideEntryRenderer> {
    sort: SortCriteriaType
  }

  export interface SubscriptionsGuideSectionRenderer {
    guideSubscriptionsSectionRenderer: YouTubeGuideSectionRendererProperties
  }

  export interface InitialGuideData {
    reponseContext: unknown
    items: Array<YouTube.GuideSectionRenderer | YouTube.SubscriptionsGuideSectionRenderer>
    trackingParams: string
  }
}

declare global {
  interface Window {
    yt: {
      config_: {
        ID_TOKEN: string
      }
    }
    ytInitialGuideData: YouTube.InitialGuideData
  }
}

export default {
  DropDown,
  Guide,
}
