import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { PrimaryButton } from '../designsystem/Buttons'
import usePreference from '../../hooks/usePreference'
import { ZIndex } from '../../styled/zIndex'
import { SolidSurface } from '../designsystem/Surface'

const CookieWrapper = styled(SolidSurface)(
  ({ theme }) => css`
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${theme.colors.text};
    background: ${theme.colors.layerBgSolid};
    z-index: ${ZIndex.COOKIEBAR};
  `
)

const StyledSpan = styled.span`
  height: min-content;
`

export default function CookieConfirmation() {
  const [, setCookies] = usePreference('cookies')

  const handleAccept = useCallback(() => setCookies(true), [setCookies])
}
