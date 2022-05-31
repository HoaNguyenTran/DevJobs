import { LeftOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { getDetailCompanyApi } from 'api/client/company';
import router from 'next/router';
import React, { useEffect, useState } from 'react'
import { configConstant } from 'src/constants/configConstant';
import { handleError } from 'src/utils/helper';
import UploadAvatar from '../components/UploadAvatar/UploadAvatar';
import InfoEnterprise from '../modules/InfoEnterprise/InfoEnterprise';
import InfoStaff from '../modules/InfoStaff/InfoStaff';
import styles from "./EnterpriseDetail.module.scss"

const EnterpriseDetail = ({ enterpriseId }): JSX.Element => {
  const [form] = Form.useForm();
  const [detailCompany, setDetailCompany] = useState<any>({})

  // console.log(detailCompany);


  const [avatar, setAvatar] = useState()
  const [addressEnterprise, setAddressEnterprise] = useState<any>([])

  const [imgList, setImgList] = useState([])


  const [tabInfo, setTabInfo] = useState(0)


  const fetchData = async () => {
    try {
      const { data = {} } = await getDetailCompanyApi(enterpriseId)
      setAvatar(data.avatar)
      
      const obj: any = {
        fullName: data.name,
        shortName: data.shortName,
        phoneNumber: data.contactPhone,
        email: data.email,
        website: data.website,
        inductry: data.industryId,
        scale: data.numEmployee,
        address: data.companyAddress,
        introduction: data.desc,
        
        // imagesJson: data.imagesJson
      }
      if(data.introLink) {
        obj.introLink = `https://www.youtube.com/watch?v=${data.introLink}` 
      }
      setDetailCompany(obj)
      form.setFieldsValue(obj)
      setAddressEnterprise(data.companyAddress || [])

      setImgList(JSON.parse(data.imagesJson || "[]" ))
    } catch (error) {
      handleError(error)
      router.replace("/404")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const renderTab = () => tabInfo === 1
    ? <InfoStaff
      enterpriseId={enterpriseId}
      detailCompany={detailCompany}
    />
    : <InfoEnterprise
      detailCompany={detailCompany}
      enterpriseId={enterpriseId}
      form={form}
      avatar={avatar}
      addressEnterprise={addressEnterprise}
      setAddressEnterprise={setAddressEnterprise}
      triggerFetchDetailCompany={fetchData}
      imgList={imgList}
    />


  return (
    <div className={`enterprise ${styles.enterprise}`}>
      <div className={styles.enterprise_wrap}>
        <div className={styles.enterprise_back} onClick={() => router.back()}><LeftOutlined /> Quay lại</div>

        <div className={styles.enterprise_header}>
          <div className={styles.header_inner}>
            <div className={styles.header_title}>Thông tin doanh nghiệp</div>
            <div className={styles.header_main}>
              <div className={`${styles.header_avatar} cursor-pointer`}>
                {
                  tabInfo === 1
                    ? <img alt="" src={avatar || configConstant.defaultPicture} />
                    : <>
                     <UploadAvatar avatar={avatar || configConstant.defaultPicture} setAvatar={setAvatar} />
                     <img alt="" src="/assets/icons/default/camera.svg" className={styles.header_avatar_camera}  />
                    </>
                }
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{detailCompany.fullName}</div>
                <div>
                  <div className={styles.shortName}>{detailCompany.shortName}</div>
                  {detailCompany.isVerified ? (
                    <div className={styles.verify}>
                      <img alt="" src="/assets/icons/color/isVerified.svg" />
                      &nbsp;
                      <span>Doanh nghiệp đã được xác thực</span>
                    </div>
                  ) : (
                    <div className={styles.verify}>
                      <img alt="" src="/assets/icons/color/unVerified.svg" />
                      &nbsp;
                      <span>Doanh nghiệp chưa được xác thực</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className={styles.enterprise_tab}>
          <div className={styles.enterprise_overlay} style={{ transform: `translateX(${(tabInfo) * 560}px)` }} />
          <div className={styles.tab_tab} onClick={() => { setTabInfo(0) }}>
            <span>
              Thông tin doanh nghiệp
            </span>
          </div>
          <div className={styles.tab_tab} onClick={() => { setTabInfo(1) }}>
            <span>
              Danh sách nhân sự
            </span>
          </div>
        </div>
        {renderTab()}
      </div>

    </div>
  )
}

export default EnterpriseDetail