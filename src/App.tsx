import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { Routes } from './Routes'

import { CycleContextProvider } from './contexts/cycleContext'

import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CycleContextProvider>
          <Routes />
        </CycleContextProvider>
        <GlobalStyle />
      </BrowserRouter>
    </ThemeProvider>
  )
}
