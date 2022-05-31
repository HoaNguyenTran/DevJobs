import { message, Switch, Upload } from 'antd';
import { patchUpdateUserApi } from 'api/client/user';
import axios from 'axios';
import React, { useState } from 'react'
import { configConstant } from 'src/constants/configConstant';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getProfileRequest } from 'src/redux/user';
import { getTokenUser, handleError } from 'src/utils/helper';
import UploadAvatar from '../UploadAvatar/UploadAvatar';
import styles from "./InfoHeader.module.scss"

const InfoHeader = ({ setTabInfo }): JSX.Element => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(state => state.user.profile || {})
  const [avatar, setAvatar] = useState(profile.avatar || configConstant.defaultPicture)
  const [loading, setLoading] = useState(false)

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'application/pdf';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể upload file pdf!');
    }
    const isLt2M = file.size / 1024 / 1024 / 1024 / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }


  const props = {
    name: 'file',
    multiple: false,
    accept: ".pdf",
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    //   'Authorization': `Bearer ${getTokenUser()}`,
    // },
    onRemove: file => {
      // getAvatar('')
    },
    customRequest: async (options: any) => {
      const fmData = new FormData()
      fmData.append('file', options.file)
      const config = {
        'headers': {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getTokenUser()}`,
        },
      }
      try {
        const result = await axios.post(options.action, fmData, config)
        options.onSuccess(null, options.file)
        const { data } = await patchUpdateUserApi(profile.code, {
          cvLink: result.data.linkUrl
        })

        message.success("Tải CV thành công!")
        dispatch(getProfileRequest({ userCode: profile.code }))
      } catch (error) {
        options.onError()
        message.error('Có lỗi xảy ra trong quá trình tải ảnh lên')
      }
    },
  }

  const handleDomainPostImg = () => {
    if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development)
      return configConstant.domainStagingEnv
    return process.env.NEXT_PUBLIC_API_URL
  }

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
    <div className={styles.infoHeader}>
      <div className={styles.infoHeader_wrap}>
        <div className={styles.header_inner}>
          <div className={styles.header_title}>Hồ sơ cá nhân</div>
          <div className={styles.header_main}>
            <div>
              <div className={styles.header_avatar}>
                <UploadAvatar avatar={avatar} setAvatar={setAvatar} />
              </div>

              <div className={styles.info}>
                <div className={styles.name}>{profile.name}</div>
                <div>
                  {profile.verifyKyc ? (
                    <div className={styles.verify}>
                      <img alt="" src="/assets/icons/color/isVerified.svg" />
                      &nbsp;
                      <span>Tài khoản đã được xác thực</span>
                    </div>
                  ) : (
                    <div className={styles.verify}>
                      <img alt="" src="/assets/icons/color/unVerified.svg" />
                      &nbsp;
                      <span>Tài khoản chưa được xác thực</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.action}>
              <div className={styles.action_inner}>
                {/* <div className={styles.status}>
                  <span>Trạng thái tìm việc: </span>
                  <Switch defaultChecked={!!profile.wantNewJob} onChange={handleChangeStatusFindJob} loading={loading} />
                </div> */}
                <div className={styles.cv_upload} onClick={() => setTabInfo(1)}>
                  <Upload
                    {...props}
                    action={`${handleDomainPostImg()}/upload/v1.0/upload`}
                    multiple={false}
                    beforeUpload={beforeUpload}
                    className={styles.avatar}
                  >
                    <img alt="" src="/assets/images/portfolio/icon/5.svg" />
                    Tải lên CV
                  </Upload>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoHeader