/* eslint-disable no-nested-ternary */
import { Divider, Image, Pagination } from 'antd'
import { getBlogApi, getListCategory } from 'api/client/blog'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { configConstant } from 'src/constants/configConstant'
import defaultConstant from 'src/constants/defaultConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from './tags.module.scss'

const limitRelatedNews = 12;

const BlogPage = (): JSX.Element => {
  const router = useRouter()
  const [newsData, setNewsData] = useState<BlogGlobal.Blog[]>([])

  const [total, setTotal] = useState(1)
  const [listCategory, setListCategory] = useState<BlogGlobal.CategoryBlog[]>([])

  const handleNews = async () => {
    const {page, category, type, tagIds} = router.query;
    try {
      const obj:any = {
        page: Number(page || 1),
        limit: limitRelatedNews,
      }
      if(tagIds) {
        obj.tagIds = tagIds;
      }
      const fnews = await getBlogApi(obj)
      setNewsData(fnews.data.data)
      setTotal(fnews.data.meta.pagination.total)
    } catch (error) {
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
    router.push({ 
      pathname: `${routerPathConstant.blogs}/${slug}`,
      query: {
        tagIds: router.query.tagIds
      }
      })
  }
  const getListCategoryBlog = async () => {
    try {
      const result = await getListCategory(3);
      setListCategory([...result.data]);
    } catch (error) {
      handleError(error)
    }
  }
  useEffect(() => {
    handleNews()
  }, [JSON.stringify(router.query)])

  useEffect(() => {
    getListCategoryBlog()
  }, [])

  const tagName = router.query.tagName || "";

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
        
          <Divider />
          <div className={styles.another}>
              {!!newsData.length && <div className={styles.another_title}>
              Bài viết theo: <span style={{color: "var(--secondary-color)"}}>#{tagName}</span>
              </div>}
            <div className={styles.another_list}>{renderNewBlogs}</div>
            <div className={styles.another_pagination}>
                <Pagination
                  current={Number(router.query.page || 1)}
                  defaultCurrent={total}
                  total={total}
                  pageSize={limitRelatedNews}
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
