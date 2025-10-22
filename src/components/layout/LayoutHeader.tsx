import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCount } from '../../redux/selectors'
import SearchEditor from '../features/SearchEditor'
import Header from '../features/Header'
import LayoutElementProps from './LayoutElementProps'
import { NO_OP } from '../../data/types'
import SearchPlaceholder from '../widgets/SearchPlaceholder'
import ResultsTitle from '../widgets/ResultsTitle'
import styled, { css } from 'styled-components'
// Faded not used here; TagSeo renders its own faded text
import TagSeo from '../seo/TagSeo'

// (Removed unused News* styled components)

const Hero = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: ${theme.dimensions.hugeSpacing};
    margin-bottom: ${theme.dimensions.hugeSpacing};

    img {
      max-width: 45%;
      height: auto;
      display: block;
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `
)

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
      <Hero>
      <img
        src="https://raw.githubusercontent.com/squirrelcharts-boop/reimagined-carnival/refs/heads/main/image%20(2).png"
        alt="hero"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      </Hero>
      <TagSeo />
      <SearchEditor onLoad={onLoad} />
      {count > 0 ? <ResultsTitle /> : <SearchPlaceholder />}
    </div>
  )
}
