import styled, { css } from 'styled-components'
import { ButtonContainerProps } from './types'

const buttonVariants = {
  primary: 'purple',
  secondary: 'green',
  danger: 'red',
  success: 'blue',
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  background-color: ${(props) => props.theme.primary};

  /* ${(props) => {
    return css`
      background-color: ${buttonVariants[props.variant]};
    `
  }} */
`
