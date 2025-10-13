import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InifinteColumn from '../layout/infinite/InfiniteColumn'
import { ListPost } from '../post/Post'
import { getMoreResults, getResults } from '../../redux/actions'
import {
  selectHasMoreResults,
  selectPageNumber,
  selectPageSize,
  selectPosts,
  selectResultsLayout,
  selectUpdated,
} from '../../redux/selectors'
import { selectActiveTags } from '../../redux/selectors'
import { addTag } from '../../redux/actions'
import { serializeTagname } from '../../data/tagUtils'
import LayoutHeader from '../layout/LayoutHeader'
import LayoutOutOfItems from '../layout/LayoutOutOfItems'
import LayoutLoadingItem from '../layout/LayoutLoadingItem'
import PageLayout from '../layout/pages/PageLayout'
import { useScrollUpBackNavigation } from '../../hooks/useScrollUpBackNavigation'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function Search() {
  const [isLoading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const activeTags = useSelector(selectActiveTags)
  const [lastUpdated, setLastUpdated] = useState(-1)

  const updated = useSelector(selectUpdated)
  const posts = useSelector(selectPosts)
  const hasMorePosts = useSelector(selectHasMoreResults)
  const resultsLayout = useSelector(selectResultsLayout)
  const pageSize = useSelector(selectPageSize)
  const pageNumber = useSelector(selectPageNumber)

  const loadMore = useCallback(() => {
    setLoading(true)
    dispatch(getMoreResults())
  }, [dispatch])

  const loadPage = useCallback(
    (index: number) => {
      setLoading(true)
      dispatch(getResults(index))
    },
    [dispatch]
  )

  React.useEffect(() => {
    if (isLoading && updated > lastUpdated) {
      setLoading(false)
      setLastUpdated(new Date().getTime())
    }
  }, [isLoading, lastUpdated, updated])

  useScrollUpBackNavigation('#results')

  // Compute a readable title from active tags
  const makeTitleFromTags = () => {
    const names = Object.keys(activeTags || {})
    if (!names || names.length === 0) return 'Rule 34'
    const pretty = names
      .map((n) => decodeURIComponent(n).replace(/_/g, ' '))
      .join(' ')
    return `Rule 34 - ${pretty}`
  }

  usePageTitle(makeTitleFromTags())

  // Parse tags from the URL hash on mount (format: #/...tags=tag1,tag2)
  useEffect(() => {
    try {
      const hash = window.location.hash || ''
      // extract query part after ?
      const qIndex = hash.indexOf('?')
      if (qIndex !== -1) {
        const query = new URLSearchParams(hash.slice(qIndex + 1))
        const tagsParam = query.get('tags')
        if (tagsParam) {
          const parts = tagsParam.split(',').filter(Boolean)
          parts.forEach((p) => {
            // format: optional leading '-' for negative modifier, then serialized name
            const isNegative = p[0] === '-'
            const raw = isNegative ? p.slice(1) : p
            const name = decodeURIComponent(raw)
            const modifier = isNegative ? '-' : '+'
            dispatch(addTag({ name, types: [], modifier }))
          })
        }
      }
    } catch (e) {
      // ignore
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync active tags to URL hash when they change
  useEffect(() => {
    try {
      const entries = Object.values(activeTags || {}).map((t) => {
        const mod = (t as any).modifier === '-' ? '-' : ''
        return `${mod}${encodeURIComponent(serializeTagname((t as any).name))}`
      })
      if (entries.length === 0) return
      const encoded = entries.join(',')
      // preserve existing path (hash until '?') and append query
      const hash = window.location.hash || '#/'
      const path = hash.split('?')[0]
      window.history.replaceState(null, '', `${path}?tags=${encoded}`)
    } catch (e) {
      // ignore
    }
  }, [activeTags])

  return (
    <>
      {resultsLayout === 'infinite_column' ? (
        <InifinteColumn
          Header={LayoutHeader}
          OutOfItems={LayoutOutOfItems}
          items={posts}
          LoadingItem={LayoutLoadingItem}
          hasMoreRows={hasMorePosts}
          ItemComponent={ListPost}
          loadMore={loadMore}
          isLoading={isLoading}
        />
      ) : (
        <PageLayout
          header={<LayoutHeader />}
          pageSize={pageSize}
          currentPage={pageNumber}
          hasMorePages={hasMorePosts}
          loadPage={loadPage}
          ItemComponent={ListPost}
          isLoading={isLoading}
          items={posts}
        />
      )}
    </>
  )
}
