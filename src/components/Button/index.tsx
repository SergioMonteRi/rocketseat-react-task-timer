import { ButtonContainer } from './styles'
import { ButtonProps } from './types'

export const Button = (props: ButtonProps) => {
  const { variant = 'primary' } = props

  return <ButtonContainer variant={variant}>Enviar</ButtonContainer>
}
