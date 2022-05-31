import React from 'react'

import { Radio } from 'antd'
import { useAppSelector } from 'src/redux'
import styles from './WorkExperience.module.scss'



const expConstants = {
  noRequire: {
    key: 0,
    name: "Không có kinh nghiệm"
  },
  chooseSkill: {
    key: 1,
    name: "Đã có kinh nghiệm"
  }
}


const WorkExperience = ({ propsData }): JSX.Element => {

  const {
    FjobCategory: categoryList = [],
    FjobExperience: experienceList = []
  } = useAppSelector(state => state.initData.data)



  const renderExp = (propsData.experiences || []).map(exp => (
    <div key={exp.id} className={styles.experience_item}>
      <div className={styles.img}>
        <img alt="" src={categoryList.find(item => item.id === categoryList.find(cate => cate.id === 1009)?.parentId)?.avatar || "https://storage.googleapis.com/fjob-prod-storage/categories/sieuthi.png"} />
      </div>

      <div className={styles.content}>
        <div className={styles.item}>
          Vị trí làm việc:&nbsp;
          <span>
            {categoryList.find(i => i.id === exp.categoryId)?.name}
          </span>
        </div>
        <div className={styles.item}>
          Thời gian:&nbsp;
          <span>
            {experienceList.find(i => i.id === exp.experienceId)?.name}
          </span>
        </div>
        {exp.note && <div className={styles.item}>
          Ghi chú:&nbsp;
          <span>
            {exp.note}
          </span>
        </div>}
      </div>

    </div>
  ))


  return (
    <div className={styles.experience}>
      <div className={styles.experience_header}>
        <div className={styles.experience_title}>
          <div className={styles.title}>Kinh nghiệm làm việc
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
      </div>
      <div className={styles.experience_status}>
        <div className={styles.radio}>
          {propsData.hasExperience !== expConstants.chooseSkill.key && expConstants.noRequire.name}
        </div>

      </div>
      <div className={styles.experience_content}>{renderExp}</div>
    </div >
  )
}
export default WorkExperience
