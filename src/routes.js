import { element } from 'prop-types'
import react from 'react'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

const Alimentacion=React.lazy(()=>import('./views/pages/alimentacion/Alimentacion'))
const Identificacion=React.lazy(()=>import('./views/pages/identificacion/Identificacion'))
const Produccion=React.lazy(()=>import('./views/pages/produccion/Produccion'))
const Sanidad=React.lazy(()=>import('./views/pages/sanidad/Sanidad'))
const QrShow=react.lazy(()=>import('./views/pages/qrshow/QrShow'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/alimentacion', name: 'Alimentacion', element: Alimentacion},
  { path: '/identificacion', name: 'Identificacion', element: Identificacion},
  { path: '/produccion', name: 'Produccion', element: Produccion},
  { path: '/qrshow/:id', name: 'QrShow', element: QrShow},
  { path: '/sanidad', name: 'Sanidad', element: Sanidad},
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
]

export default routes
