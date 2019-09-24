import { createGlobalStyle } from 'styled-components'
import { get } from '../utils/theme'

export const Global = createGlobalStyle`
  .icon-link {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif'; 
    -webkit-font-smoothing: antialiased;
    ${get('styles.body')};
  }

  .with-overlay {
    overflow: hidden;
  }

  html,
  body,
  #root {
    height: 100%;
    min-height: 100%;
  }
`
