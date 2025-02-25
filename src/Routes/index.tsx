import { Route, Routes as RoutesDom } from 'react-router-dom'

import { Home } from '../pages/Home'
import { History } from '../pages/History'

import { DefaultLayout } from '../layouts/DefaultLayout'

export const Routes = () => {
  return (
    <RoutesDom>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </RoutesDom>
  )
}
