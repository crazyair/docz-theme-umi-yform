import React, { SFC, Fragment, useEffect, useState, useRef, useMemo } from 'react'
import { Icon } from 'antd';
import { PageProps, useConfig, Link } from 'docz'
import Edit from 'react-feather/dist/icons/edit-2'
import styled from 'styled-components'

import { ButtonLink } from './Button'
import { Sidebar, Main } from '../shared'
import { get } from '../../utils/theme'
import { mq } from '../../styles/responsive'

const Wrapper = styled.div`
  flex: 1;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
  min-width: 0;
  position: relative;

  display: flex;
  flex-direction: row;
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

export const Container = styled.div<{ fullpage?: boolean }>`
  box-sizing: border-box;

  ${props =>
    mq({
      width: props.fullpage
        ? ['100%', '100%', '100%']
        : ['100%', 'calc(100% - 113px)', 'calc(100% - 113px)'],
      padding: ['16px 44px', '16px 48px'],
    })}

  ${get('styles.container')};
`

const EditPage = styled(ButtonLink.withComponent('a'))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 2px 8px;
  margin: 8px;
  border-radius: ${get('radii')};
  border: 1px solid ${get('colors.border')};
  opacity: 0.7;
  transition: opacity 0.4s;
  font-size: 14px;
  color: ${get('colors.text')};
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    opacity: 1;
    background: ${get('colors.border')};
  }

  ${mq({
    visibility: ['hidden', 'hidden', 'visible'],
    top: [0, -60, 32],
    right: [0, 0, 40],
  })};
`

const EditIcon = styled(Edit)<{ width: number }>`
  margin-right: 5px;
`

interface AnchorProps {
  slug: string
  isCurrent: boolean
  depth: number
}

const AnchorWrapper = styled.div`
  position: relative;
  padding-top: 24px;

  > div {
    position: fixed;
  }
`

const Anchor = styled.div<AnchorProps>`
  border-left: 1px solid #f0f0f0;
  border-color: ${props => (props.isCurrent ? get('colors.blue') : '#f0f0f0')};
  line-height: 20px;
  padding: ${props => (props.depth === 2 ? '4px 16px' : '4px 16px 4px 28px')};
  > a {
    width: 80px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const LinkWrapper = styled(Link)`
  font-size: 12px;
`

export const Page: SFC<PageProps> = ({
  children,
  doc: { link, fullpage, edit = false, headings },
}) => {
  const { title, base, themeConfig } = useConfig();

  // 右侧锚点只跟踪 h2 和 h3
  const anchors = headings.filter(v => [2, 3].includes(v.depth))
  const { hash } = location

  const [currentSlug, setCurrentSlug] = useState()
  const mounted = useRef(false)

  const handler = () => {
    if (mounted.current) {
      setCurrentSlug(localStorage.getItem('currentSlug'))
    } else {
      mounted.current = true
    }
  }

  useEffect(() => {
    if (hash) {
      setCurrentSlug(decodeURI(hash.slice(1)))
      if(!document.querySelector(decodeURI(hash))){
        setTimeout(()=>{
          const dom = document.querySelector(decodeURI(hash));
          if(dom){
            const distance = (dom as HTMLElement).offsetTop - 16;
            window.scrollTo(0, distance);
            setCurrentSlug(decodeURI(hash).slice(1));
          }
        }, 600)
      }
    } else if (anchors.length) {
      setCurrentSlug(anchors[0].slug)
    }

    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('storage', handler)
    }
  }, [hash])

  // WARNING: 这里用了 children.props.location.pathname 来缓存 content 的内容，
  // 避免 hash change 的时候，playground 重新渲染，实现方案有待商榷
  const content = useMemo(()=> (
    <Fragment>
      {link && edit && (
        <EditPage href={link} target="_blank">
          <EditIcon width={14} /> Edit page
        </EditPage>
      )}
      {children}
    </Fragment>
  ), [link, edit, children && children.props.location.pathname])

  const highlightAnchor = (slug: string) => {
    if (currentSlug === slug) {
      return { color: '#1890ff' }
    } else {
      return { color: 'rgba(0, 0, 0, .65' }
    }
  }

  const onClickAnchor = (e: any, slug: string) => {
    e.preventDefault();
    const dom = document.querySelector('#' + slug) as HTMLElement;
    if(dom){
      window.location.hash = '#' + slug;
      window.setTimeout(()=>{
        const distance = dom.offsetTop - 16;
        window.scrollTo(0, distance);
      })
    }
  }

  const pathNameList = location.pathname.split('/');
  const isChinese = pathNameList.includes('zh-cn');
  const newHref = isChinese ? pathNameList.filter(ele => ele !== 'zh-cn').join('/') : '/zh-cn' + location.pathname;

  return (
    <Main>
      <HeaderBar>
        <Link to={typeof base === 'string' ? base : '/'}>
          <LogoText>
            {title}
          </LogoText>
        </Link>
        <div>
          <a key={'switcher'} href={newHref} target={'_self'} aria-label="language switcher" >
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
        {!fullpage && <Sidebar />}
        <Wrapper>
          <Container fullpage={fullpage}>{content}</Container>
          {!fullpage && <AnchorWrapper>
              <div>
                {anchors.map(a => (
                  <Anchor onClick={(e) => onClickAnchor(e, a.slug)} key={a.slug} slug={a.slug} isCurrent={currentSlug === a.slug} depth={a.depth}>
                    <LinkWrapper
                      className="page-anchor"
                      to={''}
                      style={highlightAnchor(a.slug)}
                    >
                      {a.value}
                    </LinkWrapper>
                  </Anchor>
                ))}
              </div>
            </AnchorWrapper>}
        </Wrapper>
      </Content>
    </Main>
  )
}
