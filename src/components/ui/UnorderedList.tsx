import styled from 'styled-components'
import { get } from '../../utils/theme'

export const UnorderedList = styled.ul`
  list-style: circle !important;

  ${get('styles.ul')};

    margin-left: 28px;

  ul li {
    padding-left: 25px;
    margin-left: 20px;
    padding-left: 4px;
  }
`
