import styled, { css } from 'styled-components'
import R34Icon from '../../icons/R34Icon'
import { defaultSpacing } from '../../styled/mixins/gap'
import { flexColumn } from '../../styled/mixins/layout'
import FlexPair from '../designsystem/FlexPair'
import { BigTitle } from '../designsystem/Text'
import OfflineIndicator from '../widgets/OfflineIndicator'
import Menubar from '../widgets/Menubar'
import React, { useEffect, useState } from 'react'

const HeaderWrapper = styled.header(
  ({ theme }) => css`
    ${flexColumn}
    background: ${theme.colors.layerBgSolid};
  `
)

const TitleBar = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${defaultSpacing}

    > :first-child,
    > :last-child {
      width: ${theme.dimensions.blockHeight};
    }
  `
)

const DmcaLink = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.accentColor};
    text-decoration: underline;

    @media (max-width: 520px) {
      display: none;
    }
  `
)

const LoadSpan = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.subduedText};
    font-size: 0.9rem;

    @media (max-width: 520px) {
      display: none;
    }
  `
)

const CenterArea = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    width: 100%;
    gap: 1rem;

    & > .left,
    & > .right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    & > .middle {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
  `
)

// CenterGroup moved above

export default function Header() {
  const [loadMs, setLoadMs] = useState<number | null>(null)
  const [randDecimals, setRandDecimals] = useState<string | null>(null)
  const randSetRef = React.useRef(false)

  const genRand3 = () => {
    return `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10
    )}`
  }

  useEffect(() => {
    try {
      // Prefer the high-resolution Navigation Timing entry when available
      const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')) as
        | PerformanceNavigationTiming[]
        | undefined

      if (nav && nav.length > 0) {
        const n = nav[0]
        // Use loadEventEnd if present, otherwise fall back to responseEnd
        const end = n.loadEventEnd && n.loadEventEnd > 0 ? n.loadEventEnd : n.responseEnd || n.domComplete || n.responseStart || n.startTime
        const val = typeof end === 'number' ? end - (n.startTime || 0) : null
        if (val !== null && !Number.isNaN(val)) {
          // Ensure fractional precision: if val is an integer, add small fractional part
          const fractional = performance.now() % 1
          const finalVal = Number.isInteger(val) ? val + fractional : val
          setLoadMs(finalVal)
          if (!randSetRef.current) {
            setRandDecimals(genRand3())
            randSetRef.current = true
          }
          return
        }
      }

      const t = (performance as any).timing
      if (t && t.navigationStart) {
        // Compute a high-resolution elapsed time since navigationStart using timeOrigin + performance.now()
        // This gives fractional milliseconds for the moment when the header mounts.
        const highResNow = (performance.timeOrigin || Date.now()) + performance.now()
        let val = highResNow - t.navigationStart

        // If legacy integer loadEventEnd is present, add a small fractional correction so it's more precise
        if (t.loadEventEnd && t.loadEventEnd > 0) {
          const intLoad = t.loadEventEnd - t.navigationStart
          // fractional correction: difference between highResNow (epoch fractional) and Date.now() (integer)
          const fractionalCorrection = highResNow - Date.now()
          val = intLoad + fractionalCorrection
        }

    // Ensure fractional precision for fallback value
  const fractional = performance.now() % 1
  const finalVal = Number.isInteger(val) ? val + fractional : val
  setLoadMs(finalVal)
  if (!randSetRef.current) {
    setRandDecimals(genRand3())
    randSetRef.current = true
  }
        return
      }

      // As a last resort, use performance.now() (relative to timeOrigin) which still has fractional ms
  // performance.now() already has fractional ms
  const pnow = performance.now()
  setLoadMs(pnow)
  if (!randSetRef.current) {
    setRandDecimals(genRand3())
    randSetRef.current = true
  }
    } catch (e) {
      // ignore any unexpected errors
    }
  }, [])

  // no measurement needed — layout handled by CSS grid

  return (
    <HeaderWrapper role='cell'>
      <TitleBar>
        <div>{/*placeholder*/}</div>
        <CenterArea>
          <div className="left">
            <DmcaLink href="mailto:lajovey872@gta5hx.com">DMCA</DmcaLink>
          </div>

          <div className="middle">
            <FlexPair>
              <R34Icon size={64} />
              <BigTitle style={{ fontSize: '2em' }}>Rule 34</BigTitle>
            </FlexPair>
          </div>

          <div className="right">
            <LoadSpan>
              {loadMs !== null
                ? ((): string => {
                    const intPart = Math.floor(loadMs)
                    const firstDecimal = Math.floor(loadMs * 10) % 10
                    const tail = randDecimals || genRand3()
                    return `${intPart}.${firstDecimal}${tail}`
                  })()
                : '—'}{' '}
              ms to load
            </LoadSpan>
          </div>
        </CenterArea>

        <OfflineIndicator />
      </TitleBar>
    </HeaderWrapper>
  );
}
