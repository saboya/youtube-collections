import useElementReady from './useElementReady'

const findGuideRendererElement = (): Element | null => document.getElementById('guide-renderer')

const findSectionsElement = (): Element | null => document.querySelector('#guide-inner-content > ytd-guide-renderer #sections')

export const useSectionsElement: () => Element | null = () => {
  const guideRendererElement = useElementReady({
    mutationCallback: findGuideRendererElement,
    targetNode: document.getElementById('guide-inner-content'),
  })

  const sectionsElement = useElementReady({
    mutationCallback: findSectionsElement,
    targetNode: guideRendererElement,
  })

  return sectionsElement
}
