import React from 'react'
import { clearFirst } from './Util'

export const PaperItem: React.FunctionComponent<JSX.IntrinsicElements['paper-item']> = clearFirst(React.forwardRef<HTMLElement>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return React.createElement('paper-icon', { ...propsWithoutChildren, ref }, children)
}))

export const YtFormattedString: React.FunctionComponent<JSX.IntrinsicElements['yt-formatted-string']> = clearFirst(React.forwardRef<HTMLElement>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return React.createElement('yt-formatted-string', { ...propsWithoutChildren, ref }, children)
}))

export const YtIcon: React.FunctionComponent<JSX.IntrinsicElements['yt-icon']> = clearFirst(React.forwardRef<HTMLElement>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return React.createElement('ytd-guide-entry-renderer', { ...propsWithoutChildren, ref }, children)
}))

export const YtImgShadow: React.FunctionComponent<JSX.IntrinsicElements['yt-img-shadow']> = clearFirst(React.forwardRef<HTMLElement>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return React.createElement('yt-img-shadow', { ...propsWithoutChildren, ref }, children)
}))

export const YtdFormattedString: React.FunctionComponent<JSX.IntrinsicElements['ytd-formatted-string']> = clearFirst(React.forwardRef<HTMLElement>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return React.createElement('ytd-formatted-string', { ...propsWithoutChildren, ref }, children)
}))

export const YtdGuideEntryRenderer: React.FunctionComponent<JSX.IntrinsicElements['ytd-guide-entry-renderer']> = clearFirst(React.forwardRef<HTMLElement>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return React.createElement('ytd-formatted-string', { ...propsWithoutChildren, ref }, children)
}))

export const YtdGuideSectionRenderer: React.FunctionComponent<JSX.IntrinsicElements['ytd-guide-section-renderer']> = clearFirst(React.forwardRef<HTMLElement>((props, ref) => {
  const { children, ...propsWithoutChildren } = props

  return React.createElement('ytd-formatted-string', { ...propsWithoutChildren, ref }, children)
}))
