import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCount } from '../../redux/selectors'
import SearchEditor from '../features/SearchEditor'
import Header from '../features/Header'
import LayoutElementProps from './LayoutElementProps'
import { NO_OP } from '../../data/types'
import SearchPlaceholder from '../widgets/SearchPlaceholder'
import ResultsTitle from '../widgets/ResultsTitle'
import { defaultSpacing } from '../../styled/mixins/gap'
import { centeredMaxWidth, flexColumn } from '../../styled/mixins/layout'
import styled, { css } from 'styled-components'
import { Faded, Title } from '../designsystem/Text'
import { Surface } from '../designsystem/Surface'

const NewsContainter = styled.div`
  ${flexColumn}
  ${defaultSpacing}
  ${centeredMaxWidth}
`

const NewsTitle = styled(Title)`
  ${({ theme }) => css`
    padding-top: ${theme.dimensions.hugeSpacing};
  `}
`

const NewsGrid = styled(Surface)`
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  row-gap: 4px;
  align-items: center;
`

const Logo = styled.img`
  height: 60px;
  grid-row: span 2;
`

// const Logo = styled(GoogleIcon)`
//   height: 60px;
//   min-width: 40px;
//   grid-row: span 2;
// `

export default function LayoutHeader({ onLoad = NO_OP, virtualRef, style }: LayoutElementProps) {
  const count = useSelector(selectCount)

  // Trigger load event when count is > 0
  // This is used to re-measure the element
  useEffect(() => {
    count > 0 && onLoad()
  }, [count, onLoad])

  return (
    <div onLoad={onLoad} ref={virtualRef} style={style} role='row'>
      <Header />
      <SearchEditor onLoad={onLoad} />
      {count > 0 ? <ResultsTitle /> : <SearchPlaceholder />}
    </div>
  )
}
