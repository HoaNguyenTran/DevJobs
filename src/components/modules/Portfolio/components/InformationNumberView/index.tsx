import { Col, message, Row, Switch } from 'antd';
import { patchUpdateUserApi } from "api/client/user";
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getProfileRequest } from "src/redux/user";
import { handleError } from "src/utils/helper";
import styles from "./InformationNumberView.module.scss";

// const styles:any = {}

const InformationNumberView = (): JSX.Element => {
  const router = useRouter()
  const profile = useAppSelector(state => state.user.profile || {})
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleChangeStatusFindJob = async (val) => {
    setLoading(true)
    try {
      await patchUpdateUserApi(profile.code, {
        wantNewJob: val ? 1 : 0,
      })
      dispatch(getProfileRequest({ userCode: profile.code }))
      setLoading(false)
      message.success(`Bạn đã ${val ? "bật" : "tắt"} trạng thái tìm việc!`)
    } catch (error) {
      handleError(error)
      setTimeout(() => setLoading(false), 1000)
    }
  }

  return (
    <div className={styles.InformationNumberView}>
      <Row className={`h-100 ${styles.wraper}`}>
        <Col xs={24} md={12} className={`${styles.status} h-100`}>
          <div className={styles.title}>Thống kê lượt xem từ nhà tuyển dụng</div>
          <div className={styles.label}>Phần này chỉ hiển thị với bạn</div>
          <div className={styles.switch}>
            <Switch defaultChecked={!!profile.wantNewJob} onChange={handleChangeStatusFindJob} loading={loading} />
            <span style={{marginLeft:"10px"}}>Trạng thái tìm việc: </span>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className={`${styles.items} h-100`}>
            <div className={`${styles.item} mr-5`}>
              <div className={styles.count}>{ profile.erViewProfileCount || 0}</div>
              <div className={styles.label}>Nhà tuyển dụng xem hồ sơ</div>
            </div>
            <div className={styles.item}>
              <div className={styles.count}>{ profile.eeViewProfileCount || 0}</div>
              <div className={styles.label}>Số lần xem xem hồ sơ</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default InformationNumberView