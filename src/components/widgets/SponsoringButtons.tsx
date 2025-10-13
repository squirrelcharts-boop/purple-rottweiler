import React from 'react'
import styled from 'styled-components'
import { PatreonIcon } from '../../icons/FontAwesomeIcons'
import { LinkButton } from '../designsystem/Buttons'

const KofiImage = styled.img`
  height: 13px !important;
  width: 20px !important;
`

interface KofiButtonProps {
  id: string
  label: string
}

export function KofiButton(props: KofiButtonProps) {
  const { id, label } = props

  return (
    <LinkButton title={label} href={`https://ko-fi.com/${id}`} target='_blank' rel='noopener noreferrer'>
      <KofiImage src='https://ko-fi.com/img/cup-border.png' className='kofiimg' alt='Ko-Fi button' />
      <span>{label}</span>
    </LinkButton>
  )
}

interface PatreonButtonProps {
  name: string
  label: string
}

export function PatreonButton(props: PatreonButtonProps) {
  const { name, label } = props

  return (
    <LinkButton title={label} href={`https://www.patreon.com/${name}`} target='_blank' rel='noopener noreferrer'>
      <PatreonIcon color='currentcolor' />
      <span>{label}</span>
    </LinkButton>
  )
}