/* eslint-disable no-sequences */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, message, Modal, Select, Upload } from 'antd'
import {
  deleteUserEducationApi,
  getAllDataSchoolApi,
  updateUserEducationApi,
} from 'api/client/user'
import { format, getUnixTime } from 'date-fns'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { DeleteOutlined, EditOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons'
import { getTokenUser, handleError } from 'src/utils/helper'
import debounce from "lodash.debounce"
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import axios from 'axios'
import { configConstant } from 'src/constants/configConstant'
import styles from './Academic.module.scss'


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}

const Academic = ({ propsData }): JSX.Element => {





  const renderItem = propsData.educations?.map(item => {
    const timeStart = format(new Date(item.startDate * 1000), 'dd/MM/yyyy')
    const timeEnd = item.endDate ? format(new Date(item.endDate * 1000), 'dd/MM/yyyy') : null

    return (
      <div key={item.id} className={styles.academic_item}>
        <div className={styles.academic_content}>

          <div className={styles.academic_info}>
            <div className={styles.academic_avatar}>
              <img alt="" src="/assets/images/portfolio/index.svg" />
            </div>
            <div className={styles.academic_text}>
              <div className={styles.title}>Trường: {item.name}</div>
              <div className={styles.score}>Ngành học: <span>{item.major}</span></div>
              <div className={styles.time}>{timeStart} - {timeEnd || 'nay'}</div>
            </div>

          </div>

          <div className={styles.academic_degree}>
            {!!item.grade && <div className={styles.academic_text_score}>Điểm học tập (GPA) : <span>{item.grade}</span></div>}
            {item.degree && <div>Bằng cấp: <span>{item.degree}</span></div>}
          </div>

          {/* <div className={styles.sub}>
            <p>{timeStart} - {timeEnd || 'nay'}</p>
            {item.otherDesc && <p>Ghi chú: {item.otherDesc}</p>}
          </div> */}

          <div className={styles.academic_certificate}>
            <img alt="" src={item.certificateImg} />
          </div>
        </div>


      </div>
    )
  })




  return (
    <div className={styles.academic}>
      <div className={styles.academic_header}>
        <div className={styles.academic_title}>
          <div className={styles.title}>Học vấn
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
      </div>

      <div className={styles.academic_main}>{renderItem}</div>
    </div>
  )
}
export default Academic
