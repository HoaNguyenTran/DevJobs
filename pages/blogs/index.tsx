/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'

import { Col, Divider, Image, Pagination, Row, Spin } from 'antd'

import { useRouter } from 'next/router'
import { ClockCircleOutlined } from '@ant-design/icons'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import { getBlogApi, getListCategory } from 'api/client/blog'
import moment from 'moment'
import defaultConstant from 'src/constants/defaultConstant'
import { roleConstant } from 'src/constants/roleConstant'
import id from 'date-fns/esm/locale/id/index.js'
import styles from './blogs.module.scss'

enum TypeCategory {
  ER = 1,
  EE = 2,
  ALL = 3
}

const limitBestNews = 7;
const limitRelatedNews = 12;

const BlogPage = (): JSX.Element => {
  const router = useRouter()
  const [newsData, setNewsData] = useState<BlogGlobal.Blog[]>([])
  const [bestNews, setBestNews] = useState<BlogGlobal.Blog[]>([])

  const [pagingMetaData, setPagingMetaData] = useState({ totalPages: 0, currentPage: 0 })
  const { type } = router.query
  const [listCategory, setListCategory] = useState<BlogGlobal.CategoryBlog[]>([])
  const typeBlog = type === roleConstant.EE.name ? TypeCategory.EE : roleConstant.ER.name === type ? TypeCategory.ER : TypeCategory.ALL as number

  useEffect(() => {
    getListCategoryBlog()
  }, [])

  useEffect(() => {
    handleNews()
    handleBestNew()
  }, [JSON.stringify(router.query)])


  const getListCategoryBlog = async () => {
    try {
      const result = await getListCategory(typeBlog);
      setListCategory([defaultCategory, ...result.data]);
    } catch (error) {
      handleError(error)
    }
  }

  const defaultCategory = {
    id: 0,
    name: "Xem tất cả",
    type: typeBlog
  }

  const handleNews = async () => {
    const {page, category} = router.query;

    try {
      const obj:any = {
        page: Number(page || 1),
        limit: limitRelatedNews
      }
      if(category && Number(category)) {
        obj.fjobNewCategoryId = Number(category || 0);
      } else {
        obj.type = Number(typeBlog || 0)
      } 
     
      const fnews = await getBlogApi(obj)
      setNewsData(fnews.data.data)
      setPagingMetaData(fnews.data.meta.pagination)
    } catch (error) {
      handleError(error)
    }
  }

  const handleBestNew = async () => {
    
    try {
      const {page, category, tagIds} = router.query;
      const obj:any = {
        page: Number(page) || 1,
        limit: limitBestNews
      }
      if(category && Number(category)) {
        obj.fjobNewCategoryId = Number(category || 0);
      } else {
        obj.type = Number(typeBlog || 0)
      } 
      if(tagIds) {
        obj.tagIds = tagIds;
      }
      const fnews = await getBlogApi(obj)
      setBestNews(fnews.data.data)
    } catch (error) {
      setBestNews([])
      handleError(error)
    }
  }

  const onChangePagi = (pageNumber: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: pageNumber
      }
    })
  }

  const goToDetail = (slug) => {
    const { category = 0 } = router.query
    router.push({ pathname: `${routerPathConstant.blogs}/${slug}`, query: type ? { type, category } : { category } })
  }

  const renderItemsBestBlogs = bestNews.filter((item, index) => index !== 0).map(item => (
    <div
      key={item.id}
      className={styles.item}
      onClick={() => goToDetail(item.slug)}
    >
      <div>
        <Image
          preview={false}
          src={
            item.imageUrl ?? defaultConstant.defaultLinkAvatarUser
          }
          style={{ borderRadius: '6px' }}
          width={160}
          height={90}
        />
      </div>
      <div className={styles.item_content}>
        <p className={styles.item_content_title}>{item.title}</p>
        <div className={styles.item_category}>
          {listCategory.find(i => i.id === item.fjobNewCategoryId)?.name || "Fjob"}
        </div>
        <div>
          <ClockCircleOutlined style={{ color: '#838383' }} />
          <span className={styles.item_time}>{moment(item.startTime).format(configConstant.displayTime.DDMMYYY)}</span>
        </div>
      </div>
    </div>
  ))

  const renderNewBlogs = newsData.map(item => (
    <div key={item.id}>
      <div
        className={styles.news}
        onClick={() => goToDetail(item.slug)}
      >
        <div className={styles.new_image}>
          <Image
            preview={false}
            style={{ borderRadius: '6px' }}
            src={
              item.imageUrl ?? defaultConstant.defaultLinkAvatarUser
            }
            className={styles.image}
          />
        </div>
        <div className={styles.news_content}>
          <p className={styles.item_content_title}>{item.title}</p>
          <div className={styles.category_box}>
            <div className={styles.category_title}>
              <span className={styles.start_time}>{listCategory.find(i => i.id === item.fjobNewCategoryId)?.name || "Fjob"} - </span>{moment(item.startTime).format(configConstant.displayTime.DDMMYYY)}
            </div>
          </div>
          <span className={styles.news_summary}>{item.summary}</span>
        </div>
      </div>
    </div>
  ))

  const onSelectCategory = (categoryId) => {
    router.push({
      pathname: router.pathname,
      query: {
        page: 1,
        category: categoryId,
        limit: limitBestNews,
        type: router.query.type,
      }
    })
  }

  const activeCategory = parseInt(String(router.query.category), 10) || 0

  const renderCategory = (category) => (
    <div
      onClick={() => onSelectCategory(category.id)}
      key={category.id}
      className={styles.category}
      style={activeCategory === category.id
        ? { color: "white", backgroundColor: "#6E00C2", fontWeight: "bold" }
        : { border: "1px solid #E7E7E7" }}>
      {category.name}
    </div>
  )

  return (
    <div className={`blogs ${styles.main}`}>
      {/* {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100 vw-100 ">
          <Spin />
        </div>
      ) : ( */}
        <div className={styles.main_wrap}>
          <Image
            preview={false}
            src="/assets/images/banners/BannerBlogs.png"
          />
          <div className={styles.breadcrumb}>
            <div onClick={() => router.push("/")}>
              <img alt="" src="/assets/icons/default/home.svg" />
            </div>
            <div style={{ paddingLeft: 5, paddingRight: 5 }}>
              <img alt="" src="/assets/icons/default/arow-button-small.svg" />
            </div>
            <div style={{ fontWeight: "bold", cursor: "pointer" }}>
              Blog
            </div>
          </div>
          <div className={styles.main_list}>
            <div className={styles.main_list_category} >
              {listCategory.map(category => renderCategory(category))}
            </div>
          </div>
          {
            bestNews?.[0] && (
              <Row gutter={28}>
                <Col xs={24} md={17}>
                  <div className={`${styles.main_wrap_body_content  } cursor-pointer`} onClick={() => goToDetail(bestNews[0].slug)}>
                    <div className={styles.image}>
                      <img alt="" src={bestNews[0].imageUrl} />
                    </div>
                    <div className={styles.title}>
                      {bestNews[0].title}
                    </div>
                    <div className={styles.category_box}>
                      <div className={styles.category_title}>
                        <span className={styles.start_time}>{listCategory.find(i => i.id === bestNews[0].fjobNewCategoryId)?.name || "Fjob"} - </span>{moment(bestNews[0].startTime).format(configConstant.displayTime.DDMMYYY)}
                      </div>
                    </div>
                    <div className={styles.summary}>
                      {bestNews[0].summary}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={7}>
                  <div className={styles.main_wrap_body_relative}>
                    {renderItemsBestBlogs}
                  </div>
                </Col>
              </Row>
            )
          }
          <Divider />
          <div className={styles.another}>
              {!!newsData.length && <div className={styles.another_title}>
              Bài viết khác
              </div>}
            <div className={styles.another_list}>{renderNewBlogs}</div>
            <div className={styles.another_pagination}>
                <Pagination
                  current={pagingMetaData.currentPage}
                  defaultCurrent={pagingMetaData.currentPage}
                  total={pagingMetaData.totalPages * 10}
                  onChange={onChangePagi}
                  hideOnSinglePage
                />
            </div>
          </div>
        </div>
      {/* )
      } */}
    </div >
  )
}

export async function getServerSideProps(ctx) {
  return { props: {} }
}


export default BlogPage
