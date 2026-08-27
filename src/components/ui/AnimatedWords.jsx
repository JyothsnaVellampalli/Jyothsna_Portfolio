import { Fragment } from 'react'
import { cn } from '../../lib/cn'

/**
 * Splits text into words, wrapping each in a span that glows and scales
 * on hover. Mirrors the interactive text treatment used across the site.
 *
 * @param {string} text - the sentence to render, word by word
 * @param {string} wordClassName - extra classes applied to each word span
 */
function AnimatedWords({ text, wordClassName = '' }) {
  const words = text.split(' ')

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span
            className={cn(
              'inline-block cursor-default transition-all duration-300',
              'hover:text-foreground hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)]',
              wordClassName,
            )}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </>
  )
}

export default AnimatedWords
