import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export default function h1(props) {
  return renderToStaticMarkup(
    <div {...props.attrs}
        dangerouslySetInnerHTML={{ __html: props.content }} />
  )
}
