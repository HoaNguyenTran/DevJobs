import React from 'react'

import { useAppSelector } from 'src/redux'
import styles from './MainSkill.module.scss'



const MainSkill = ({ propsData }): JSX.Element => {

  const {
    FjobProfSkill: profSkillList = [],
    FjobExperience: experienceList = []
  } = useAppSelector(state => state.initData.data)



  const renderSkill = (propsData.profSkills || []).map(item => (
    <div className={styles.skill_item} key={item.id} >
      <div className={styles.skill_content}>
        <div className={styles.skill_title}>
          <div className={styles.title}>
            {profSkillList.find(i => i.id === item.profSkillId)?.name}
          </div>
          {!!item.experience && <p className={styles.time}>
            <div>Thời gian:</div>
            <span>
              {experienceList.find(i => i.id === item.experience)?.name}
            </span>
          </p>}
          {item.note &&
            <div className={styles.note}>
              Ghi chú:&nbsp;
              <span style={{ fontStyle: 'italic', color: 'grey' }}>&nbsp;{item.note}</span>
            </div>
          }
        </div>
      </div>
    </div>

  ))

  return (
    <div className={styles.skill}>
      <div className={styles.skill_header}>
        <div className={styles.skill_title}>
          <div className={styles.title}>Kỹ năng
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
      </div>

      <div className={styles.content}>{renderSkill}</div>

    </div>
  )
}

export default MainSkill
