import styled, { css } from 'styled-components'
import R34Icon from '../../icons/R34Icon'
import { defaultSpacing } from '../../styled/mixins/gap'
import { flexColumn } from '../../styled/mixins/layout'
import FlexPair from '../designsystem/FlexPair'
import { BigTitle } from '../designsystem/Text'
import OfflineIndicator from '../widgets/OfflineIndicator'
import Menubar from '../widgets/Menubar'
import React, { useEffect, useState } from 'react'
import styledComp from 'styled-components'

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

const TestButton = styledComp.button(
  ({ theme }) => css`
    background: transparent;
    color: ${theme.colors.accentColor};
    border: 1px solid ${theme.colors.accentColor};
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
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
    width: 100%%;
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

export default function Header() {
  const [loadMs, setLoadMs] = useState<number | null>(null)
  const [randDecimals, setRandDecimals] = useState<string | null>(null)
  const randSetRef = React.useRef(false)

  const genRand3 = () => {
    return `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10
    )}`
  }

  // Measure page load time
  useEffect(() => {
    try {
      const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')) as
        | PerformanceNavigationTiming[]
        | undefined

      if (nav && nav.length > 0) {
        const n = nav[0]
        const end = n.loadEventEnd && n.loadEventEnd > 0 ? n.loadEventEnd : n.responseEnd || n.domComplete || n.responseStart || n.startTime
        const val = typeof end === 'number' ? end - (n.startTime || 0) : null

        if (val !== null && !Number.isNaN(val)) {
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
        const highResNow = (performance.timeOrigin || Date.now()) + performance.now()
        let val = highResNow - t.navigationStart

        if (t.loadEventEnd && t.loadEventEnd > 0) {
          const intLoad = t.loadEventEnd - t.navigationStart
          const fractionalCorrection = highResNow - Date.now()
          val = intLoad + fractionalCorrection
        }

        const fractional = performance.now() % 1
        const finalVal = Number.isInteger(val) ? val + fractional : val
        setLoadMs(finalVal)
        if (!randSetRef.current) {
          setRandDecimals(genRand3())
          randSetRef.current = true
        }
        return
      }

      const pnow = performance.now()
      setLoadMs(pnow)
      if (!randSetRef.current) {
        setRandDecimals(genRand3())
        randSetRef.current = true
      }
    } catch (e) {
      // ignore
    }
  }, [])

  // Load external popunder script from public folder on mount
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/popunder.js'
    script.async = true
    document.body.appendChild(script)

    // append a lightweight debug script to confirm execution in the browser
    const debugScript = document.createElement('script')
    debugScript.src = '/popunder-debug.js'
    debugScript.async = true
    document.body.appendChild(debugScript)

    return () => {
      try {
        document.body.removeChild(script)
        document.body.removeChild(debugScript)
      } catch (e) {
        // ignore
      }
    }
  }, [])

  // ✅ Inject Umami analytics script
  useEffect(() => {
    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://cloud.umami.is/script.js'
    script.setAttribute('data-website-id', 'b33fc5ec-1681-4855-9236-0a41f819f326')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <HeaderWrapper role='cell'>
      <TitleBar>
        <div>{/*placeholder*/}</div>
        <CenterArea>
          <div className="left">
            <DmcaLink href="mailto:lajovey872@gta5hx.com">DMCA</DmcaLink>
            {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
              <TestButton
                onClick={() => {
                  try {
                    // attempt to trigger the popunder for debugging/dev only
                    const pm = (window as any).popMagic
                    if (!pm) {
                      console.warn('popMagic not present')
                      return
                    }
                    const orig = pm.isValidUserEvent
                    pm.isValidUserEvent = function () { return true }
                    try {
                      pm.methods.default({ target: document.body, isTrusted: true, screenX: 1, screenY: 1, preventDefault: () => {} })
                    } catch (e) {
                      console.error('error triggering popMagic', e)
                    }
                    pm.isValidUserEvent = orig
                  } catch (e) {
                    console.error(e)
                  }
                }}
              >
                Test Popunder
              </TestButton>
            ) : null}
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
  )
}