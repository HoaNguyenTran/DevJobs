import { patchUpdateUserApi } from 'api/client/user'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useAppSelector } from 'src/redux'
import { handleError } from 'src/utils/helper'
import HeaderInfo from './components/HeaderInfo/HeaderInfo'
import Main from './components/Main/Main'
import Notify from './components/Notify/Notify'
import Report from './components/Report/Report'



import styles from './DashboardER.module.scss'

const Preferential = dynamic(() => import('./components/Preferential/Preferential'))
const Blog = dynamic(() => import('./components/Blog/Blog'))

const DashboardER = (): JSX.Element => {

  const profile = useAppSelector(state => state.user.profile || {})

  useEffect(() => {
    if (Object.keys(profile).length &&  profile.isEmployer !== 1) {
      const upgradeERRole = async () => {
        try {
          await patchUpdateUserApi(profile.code, {
            isEmployer: 1,
            isEmployee: 1,
            isPersonal: 1
          })
        } catch (error) {
          handleError(error)
        }
      }
      upgradeERRole()
    }
  }, [])

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard_wrap}>
        <HeaderInfo />
        <div className={styles.dashboard_information}>
          <div className={styles.info_report}>
            <Report />
          </div>
          <div className={styles.info_notify}>
            <Notify />
          </div>
        </div>

        <Main />
        <Blog />
        <Preferential />
      </div>
    </div>
  )
}


export default DashboardER
