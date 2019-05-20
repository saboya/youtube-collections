import * as React from 'react'

const style = require('./style.css')

export const SectionTitle: React.FunctionComponent = (props) => {
  return <h3 className={style.ytc__section__style}>
    {props.children}
  </h3>
}
