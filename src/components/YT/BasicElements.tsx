import * as Preact from 'preact'
import { forwardRef } from 'preact/compat'
import { JSXInternal } from 'preact/src/jsx'

import { clearFirst } from './Util'

type CustomElement = JSXInternal.HTMLAttributes<HTMLElement> | {
  class?: string
  tabindex?: string
}

type YtImgShadow = CustomElement | { height?: string, width?: string }

type YtdGuideEntryRenderer = CustomElement | { 'line-end-style': string }

declare module 'preact/src/jsx' {
  namespace JSXInternal {
    interface IntrinsicElements {
      ['paper-item']: CustomElement
      ['yt-formatted-string']: CustomElement
      ['yt-icon']: CustomElement
      ['yt-img-shadow']: YtImgShadow
      ['ytd-formatted-string']: CustomElement
      ['ytd-guide-entry-renderer']: YtdGuideEntryRenderer
      ['ytd-guide-section-renderer']: CustomElement
    }
  }
}

export const PaperItem: Preact.FunctionComponent<JSXInternal.IntrinsicElements['paper-item']> = clearFirst(forwardRef<SVGElement, JSXInternal.HTMLAttributes<SVGElement>>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return Preact.createElement('paper-icon', { ...propsWithoutChildren, ref }, children)
}))

export const YtFormattedString: Preact.FunctionComponent<JSXInternal.IntrinsicElements['yt-formatted-string']> = clearFirst(forwardRef<SVGElement, JSXInternal.HTMLAttributes<SVGElement>>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return Preact.createElement('yt-formatted-string', { ...propsWithoutChildren, ref }, children)
}))

export const YtIcon: Preact.FunctionComponent<JSXInternal.IntrinsicElements['yt-icon']> = clearFirst(forwardRef<SVGElement, JSXInternal.HTMLAttributes<SVGElement>>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return Preact.createElement('ytd-guide-entry-renderer', { ...propsWithoutChildren, ref }, children)
}))

export const YtImgShadow: Preact.FunctionComponent<JSXInternal.IntrinsicElements['yt-img-shadow']> = clearFirst(forwardRef<SVGElement, JSXInternal.HTMLAttributes<SVGElement>>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return Preact.createElement('yt-img-shadow', { ...propsWithoutChildren, ref }, children)
}))

export const YtdFormattedString: Preact.FunctionComponent<JSXInternal.IntrinsicElements['ytd-formatted-string']> = clearFirst(forwardRef<SVGElement, JSXInternal.HTMLAttributes<SVGElement>>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return Preact.createElement('ytd-formatted-string', { ...propsWithoutChildren, ref }, children)
}))

export const YtdGuideEntryRenderer: Preact.FunctionComponent<JSXInternal.IntrinsicElements['ytd-guide-entry-renderer']> = clearFirst(forwardRef<SVGElement, JSXInternal.HTMLAttributes<SVGElement>>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return Preact.createElement('ytd-formatted-string', { ...propsWithoutChildren, ref }, children)
}))

export const YtdGuideSectionRenderer: Preact.FunctionComponent<JSXInternal.IntrinsicElements['ytd-guide-section-renderer']> = clearFirst(forwardRef<SVGElement, JSXInternal.HTMLAttributes<SVGElement>>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return Preact.createElement('ytd-formatted-string', { ...propsWithoutChildren, ref }, children)
}))
