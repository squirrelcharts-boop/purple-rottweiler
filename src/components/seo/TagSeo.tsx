import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Faded } from '../designsystem/Text'
import { selectActiveTags, selectCount } from '../../redux/selectors'

const SeoBlock = styled.div(
  ({ theme }) => `
  max-width: ${theme.dimensions.bodyWidth};
  margin: ${theme.dimensions.bigSpacing} auto;
  text-align: center;
  `
)

function truncate(s: string, n = 160) {
  if (s.length <= n) return s
  return s.slice(0, n - 1).trim() + '…'
}

export default function TagSeo() {
  const activeTags = useSelector(selectActiveTags)
  const count = useSelector(selectCount)

  const names = useMemo(() => Object.keys(activeTags || {}), [activeTags])

  const prettyNames = names.map((n) => decodeURIComponent(n).replace(/_/g, ' '))

  // Build a short snippet using up to 3 tags to keep descriptions unique but compact
  const snippet = prettyNames.slice(0, 3).join(', ') + (prettyNames.length > 3 ? ' and more' : '')

  const description = truncate(`Browse ${count.toLocaleString()} results for ${snippet} on Rule 34. Find images, galleries and illustrations tagged ${prettyNames.slice(0, 6).join(', ')}. Updated frequently.`, 160)

  const namesKey = names.join(',')

  useEffect(() => {
    if (!names || names.length === 0) return
    try {
      // meta description
      let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!desc) {
        desc = document.createElement('meta')
        desc.name = 'description'
        document.head.appendChild(desc)
      }
      desc.content = description

      // og:description
      let og = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null
      if (!og) {
        og = document.createElement('meta')
        og.setAttribute('property', 'og:description')
        document.head.appendChild(og)
      }
      og.content = description

      // canonical
      const canonicalHref = window.location.href
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.href = canonicalHref
    } catch (e) {
      // ignore DOM errors in exotic environments
    }
  }, [description, count, namesKey, names])

  if (!names || names.length === 0) return null

  return (
    <SeoBlock aria-hidden>
      <Faded>{description}</Faded>
    </SeoBlock>
  )
}
