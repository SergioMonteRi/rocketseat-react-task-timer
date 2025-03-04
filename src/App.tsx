import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { Routes } from './Routes'

import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Routes />
        <GlobalStyle />
      </BrowserRouter>
    </ThemeProvider>
  )
}
