import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilApple,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilHealing,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilReportSlash,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Alimentacion',
    to: '/alimentacion',
    icon: <CIcon icon={cilApple} customClassName="nav-icon"/>
  },
  {
    component: CNavItem,
    name: 'Identificacion',
    to: '/identificacion',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon"/>
  },
  {
    component: CNavItem,
    name: 'Produccion',
    to: '/produccion',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon"/>
  },
  {
    component: CNavItem,
    name: 'Sanidad',
    to: '/sanidad',
    icon: <CIcon icon={cilHealing} customClassName="nav-icon"/>
  }
]

export default _nav
