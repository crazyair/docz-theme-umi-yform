import * as React from 'react'
import styled from 'styled-components'
import { Icon } from 'antd';
import { Link, useConfig } from 'docz';
import { Sidebar, Main } from '../shared'
import { get } from '../../utils/theme'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
`

const Title = styled.h1`
  margin: 0;
  font-size: 42px;
  font-weight: 400;
  color: ${get('colors.primary')};
`


const HeaderBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 1001;
  background: white;
  height: 55px;
  border-bottom: 1px solid #eaecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .7rem 1.5rem;
`

const Content = styled.div`
  flex: 1;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
  min-width: 0;
  position: relative;

  display: flex;
  flex-direction: row;
`

const LogoText = styled('h1')`
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0;
  color: #2c3e50;
`

const LinkText = styled.span`
  color: #2c3e50;
  line-height: 1.4rem;
  text-decoration: none;
  font-weight: 500;
  margin-left: 16px;
  font-size: .9rem;

  span {
    margin-right: 8px;
  }
`

const Subtitle = styled.p`
  margin: 0;
  font-size: 18px;
`

export const NotFound = () => {

  const pathNameList = location.pathname.split('/');
  const isChinese = pathNameList.includes('zh-cn');
  const newHref = isChinese ? pathNameList.filter(ele => ele !== 'zh-cn').join('/') : '/zh-cn' + location.pathname;

  const { title, base, themeConfig } = useConfig();
  return (<Main>
    <HeaderBar>
    <Link to={typeof base === 'string' ? base : '/'}>
      <LogoText>
        {title}
      </LogoText>
    </Link>
    <div>
      <a key='switcher' href={newHref} target={'_self'} aria-label="language switcher" >
        <LinkText>{isChinese ? 'English' : '中文'}</LinkText>
      </a>
      {
        (themeConfig.menus || []).map(menu=>{
          const ele = menu || {};
          const isExternalLink = (ele.link || '').startsWith('http') || (ele.link || '').startsWith('//');
          return (
            <a key={ele.title} href={ele.link} target={isExternalLink ? "_blank" : '_self'} aria-label="external links" ><LinkText><span>{ele.title}</span>{isExternalLink && <Icon type="link" />}</LinkText></a>
          )
        })
      }
    </div>
    </HeaderBar>
    <Content>
      <Sidebar />
      <Wrapper>
      <Title>404 Not Found</Title>
      <Subtitle>
        Hooks 走丢了，请在侧边栏重新选择要查看的 hooks!
      </Subtitle>
    </Wrapper>
    </Content>
  </Main>)
}
