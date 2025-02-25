import { Play } from 'phosphor-react'

import {
  Separator,
  FormContainer,
  HomeContainer,
  CountdownContainer,
} from './styles'

export const Home = () => {
  return (
    <HomeContainer>
      <form>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <input id="task" />

          <label htmlFor="minutesAmount">durante</label>
          <input id="minutesAmount" type="number" />

          <span>minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <button>
          <Play size={24} />
          Comecar
        </button>
      </form>
    </HomeContainer>
  )
}
