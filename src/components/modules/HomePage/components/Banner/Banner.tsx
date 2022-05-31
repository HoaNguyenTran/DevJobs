import React, { FC } from 'react'

import {
  Col,
  Form,
  Input,
  Row,
  Select,
} from 'antd'
import { useRouter } from 'next/router'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useAppSelector } from 'src/redux'
import { filterSelectOption } from 'src/utils/helper'

import { CloseOutlined } from '@ant-design/icons'

import styles from './Banner.module.scss'

const Banner: FC = () => {
  const router = useRouter()
  const [form] = Form.useForm();
  const {
    FjobCategory: categoryList = [],
    FjobProvince: provinceList = [],
  } = useAppSelector(state => state.initData.data)

  const onSearchJob = (value) => {

    const query: { search?: string, categories?: string, provinceId?: string, locationType?: number } = {}
    const keyArr = ["search", "categories", "provinceId"]

    keyArr.forEach(element => {
      if (element === "provinceId" && value[element]) {
        query[element] = value[element]
        query.locationType = 2
      } else if (value[element]) query[element] = value[element]

      // console.log(value[element]);
    });

    router.push({
      pathname: routerPathConstant.search,
      query
    })
  }


  return (
    <div className={styles.homepage_banner}>
      <div className={`${styles.banner_wrap  }`}>
        <div className={styles.banner_img}>
          <img alt="" src="/assets/images/homepage/banner/banner_small.jpg" />
        </div>
        <div className={`${styles.banner_search}`} >
          <div className={`homepage ${styles.inner} w-100`}>
            <Form form={form} onFinish={onSearchJob} >
              <Row className={`${styles.form} justify-content-center`}>
                <Col xs={24} md={9} className="w-100">
                  <Form.Item name="search">
                    <Input style={{ height: "40px", borderRadius: "8px" }} placeholder="Việc làm, từ khóa hoặc công ty" allowClear
                      // suffix={<CloseOutlined style={{ color: "grey" }} onClick={() => form.resetFields(["search"])} />} 
                      />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4} className="w-100 mt-2 mt-md-0">
                  <Form.Item name="categories" className="w-100" >
                    <Select
                      placeholder="Tất cả ngành nghề"
                      allowClear
                      showSearch
                      filterOption={filterSelectOption}
                    >
                      {categoryList.filter(cate => cate.parentId === 0).map(item =>
                      (<Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>)
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={4} className="w-100 mt-2 mt-md-0">
                <Form.Item name="provinceId" className='w-100'>
                  <Select
                   allowClear
                   showSearch
                   filterOption={filterSelectOption}
                   placeholder="Tất cả địa điểm" >
                    {provinceList.map(item =>
                    (<Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>)
                    )}
                  </Select>
                </Form.Item>
                </Col>
               
                <Col xs={24} md={3} className="w-100 mt-2 mt-md-0">
                  <div className={styles.search}>
                    <button type="submit">
                      Tìm kiếm
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner