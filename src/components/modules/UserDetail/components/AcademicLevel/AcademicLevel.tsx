
import React from 'react'
import { message, Select } from 'antd'
import { patchUserInfomationApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { filterSelectOption, handleError } from 'src/utils/helper'
import styles from './AcademicLevel.module.scss'


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}

const AcademicLevel = ({ propsData }): JSX.Element => {
  const { FjobEducationLevel: educationList = [] } = useAppSelector(state => state.initData.data)


  return (
    <div className={`portfolio ${styles.academic}`}>
      <div className={styles.academic_header}>
        <div className={styles.academic_title}>
          <div className={styles.title}>Trình độ học vấn
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
      </div>

      <div className={styles.academic_content}>
        <div>
          {educationList.find(item => item.id === propsData.academicId)?.name}
        </div>
      </div>
    </div>
  )
}
export default AcademicLevel
