import * as React from 'react'

const style = require('./style.css')

interface Props {
  label?: string
  image: string,
  counter: number,
  uri: string
}

export const SectionItem: React.FunctionComponent<Props> = (props) => {
  return (
    <li className={style.ytc__section__list__item}>
      <div className={style.ytc__paper__item}>
        <span className={style.temp}>
          {props.label}
        </span>
      </div>
    </li>
  )
}
