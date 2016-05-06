import { Entity } from 'draft-js'
import { getEntityRanges } from 'draft-js-utils'
import { h1, p, span } from './elements/index.js'

const blockElementMap = {
  'header-one': h1,
  'p': p,
  'unstyled': p,
}

class HTMLGenerator {
  constructor(contentState, styleMap) {
    this.contentState = contentState
    this.styleMap = styleMap
  }

  call() {
    return this.contentState.getBlocksAsArray().map((block) => {
      return this.parseBlock(block)
    }).join('')
  }

  parseBlock(block) {
    const type = block.getType()
    const text = block.getText()
    const characterMetadataList = block.getCharacterList()
    const entityRanges = getEntityRanges(text, characterMetadataList)

    const content   = this.applyInlineStyles(entityRanges)
    const blockHTML = this.applyBlockElementWrapper(type, content)

    return blockHTML
  }

  applyInlineStyles(entityRanges) {
    return entityRanges.map(([entityKey, styles]) => {
      return styles.map(([text, style]) => {
        if (Object.keys(style.toObject()).length > 0) {
          return this.elementWithStyle(text, style)
        } else {
          return text
        }
      }).join('')
    }).join('')
  }

  elementWithStyle(text, style) {
    return span({ style: this.getInlineStyles(style), content: text })
  }

  getInlineStyles(style) {
    let styles = {}

    Object.keys(style.toObject()).forEach((k) => {
      styles = {
        ...styles,
        ...this.styleMap[k],
      }
    })

    return styles
  }

  applyBlockElementWrapper(type, content) {
    return blockElementMap[type]({content})
  }
}

export default function(contentState, styleMap) {
  return new HTMLGenerator(contentState, styleMap).call()
}
