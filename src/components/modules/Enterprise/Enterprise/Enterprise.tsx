import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Empty, Input, message } from 'antd'
import defaultConstant from 'src/constants/defaultConstant'
import { getAllUserCompanyApi, getSearchCompanyApi } from 'api/client/company'
import { handleError } from 'src/utils/helper'
import useOnClickOutside from 'src/hooks/useClickOutside'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { useAppSelector } from 'src/redux'
import { useDispatch } from 'react-redux'
import { routerPathConstant } from 'src/constants/routerConstant'
import { patchUpdateUserApi } from 'api/client/user'
import { getProfileRequest } from 'src/redux/user'
import { configConstant } from 'src/constants/configConstant'
import { useRouter } from 'next/router'
import { userRoleInCompany } from 'src/constants/roleConstant'
import styles from "./Enterprise.module.scss"

const Enterprise = (): JSX.Element => {
  const router = useRouter()
  const ref = useRef(null)
  const dispatch = useDispatch()
  const { FjobIndustry: inducstryList } = useAppSelector(state => state.initData.data)
  const profile = useAppSelector(state => state.user.profile || {})

  const [userCompany, setUserCompany] = useState<any>({ arrAdmin: [], arrAgent: [], arrPending: [] })
  const [loading, setLoading] = useState(false)
  const [textInputSearch, setTextInputSearch] = useState("")
  const [resultsSearch, setResultsSearch] = useState<null | CompanyGlobal.CompanyDetail[]>(null)

  const [tabEnterprise, setTabEnterprise] = useState(0)

  const [detailCompanyModal, setDetailCompanyModal] = useState<any>({})
  const [isDetailCompanyModal, setIsDetailCompanyModal] = useState(false)

  useOnClickOutside(ref, () => {
    setResultsSearch(null);
  })

  function checkIfEmpty(array) {
    return Array.isArray(array) && (array.length === 0 || array.every(checkIfEmpty));
  }

  const handleJoinCompany = async () => {
    setLoading(true)
    try {
      await patchUpdateUserApi(profile.code, {
        companyId: detailCompanyModal.id,
      })
      dispatch(getProfileRequest({ userCode: profile.code }))
      fetchUserCompany()
      message.success('Xin tham gia v??o c??ng ty th??nh c??ng!')
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }



  const handleSearchEnterprise = async () => {
    if (!textInputSearch) return message.warning("B???n vui l??ng nh???p t??n doanh nghi???p!")
    try {
      const { data } = await getSearchCompanyApi(textInputSearch)
      setResultsSearch(data.data)
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
      setResultsSearch([])
    }
  }

  const fetchUserCompany = async () => {
    const data = await getAllUserCompanyApi()
    setUserCompany({
      arrAdmin: data.data.filter(item => item.userRole === userRoleInCompany.admin),
      arrAgent: data.data.filter(item => item.userRole === userRoleInCompany.agent),
      arrPending: data.data.filter(item => item.userRole === userRoleInCompany.pending),
    })
  }

  useEffect(() => {
    fetchUserCompany()
  }, [])


  const renderActionEnterEnterprise = () => {
    if (userCompany.arrAdmin.find(item => item.id === detailCompanyModal.id)) {
      return (<button disabled type="button" className={styles.model_button} style={{ cursor: "not-allowed" }}>
        B???n ??ang l?? qu???n tr??? vi??n c??ng ty n??y!
      </button>
      )
    }
    if (userCompany.arrAgent.find(item => item.id === detailCompanyModal.id)) {
      return (<button disabled type="button" className={styles.model_button} style={{ cursor: "not-allowed" }}>
        R???i doanh nghi???p
        (???? tham gia)
      </button>
      )
    }

    if (userCompany.arrPending.find(item => item.id === detailCompanyModal.id)) {
      return (
        <button disabled type="button" className={styles.model_button} style={{ cursor: "not-allowed" }}>
          H???y tham gia
          (??ang ch??? duy???t)
        </button>
      )
    }

    return (<button disabled={loading} type="button" onClick={handleJoinCompany} className={styles.model_button}>
      Xin tham gia
    </button>
    )

  }


  const renderResultSearchEnterprise = () => {
    if (!resultsSearch) return null;
    if (!resultsSearch.length) return <div className="my-4">
      <Empty description="Kh??ng t??m th???y c??ng ty n??o!" />
    </div>
    return <div className="">
      {resultsSearch.map(company => (
        <div
          key={company.id}
          className={styles.header_content_item}
          onClick={() => {
            setResultsSearch(null)
            setIsDetailCompanyModal(true)
            setDetailCompanyModal(company)
          }}
        >
          <img alt="" src={company.avatar === '' ? defaultConstant.defaultAvatarUser : company.avatar} />
          <div>
            <div className={styles.name}>{company.name}</div>
            <div>{company.shortName}</div>
          </div>
        </div>
      ))}
    </div>
  }

  const renderEnterprise = () => {
    const arrEnterprise = [userCompany.arrAdmin, userCompany.arrAgent, userCompany.arrPending][tabEnterprise];
    if (!arrEnterprise?.length) return <Empty description="Kh??ng c?? c??ng ty n??o!" />
    return <div className={styles.main_list}>
      {arrEnterprise.map(enterprise =>
        <div key={enterprise.id} className={styles.main_item} onClick={() => {
          if (tabEnterprise === 0) {
            router.push(`${routerPathConstant.erEnterprise}/${enterprise.id}`)
          } else {
            setIsDetailCompanyModal(true)
            setDetailCompanyModal(enterprise)
          }
        }}>
          <div className={styles.avatar}>
            <img alt="" src={enterprise.avatar || configConstant.defaultPicture} />
          </div>
          <div>
            <div className={styles.name}>{enterprise.name}</div>
            {/* <div>???? tham gia</div> */}
          </div>
        </div>)
      }
    </div>

  }


  return (
    <div className={styles.enterprise}>
      <div className={styles.enterprise_wrap}>
        <div className={styles.enterprise_header}>
          <div className={styles.header_inner} ref={ref} >
            <div className={styles.header_search}>
              <div className={styles.header_input}>
                <Input placeholder='T??m ki???m doanh nghi???p' value={textInputSearch}
                  onChange={(e) => setTextInputSearch(e.target.value)}
                  onPressEnter={handleSearchEnterprise}
                />
              </div>
              <div className={styles.header_btn}>
                <button type="button" onClick={handleSearchEnterprise}>
                  <SearchOutlined style={{ fontSize: "18px" }} />
                  T??m ki???m</button>
              </div>
            </div>
            <div className={styles.header_content} style={{ display: resultsSearch ? "block" : "none" }}>
              {renderResultSearchEnterprise()}
            </div>
          </div>
        </div>
        <div className={styles.enterprise_main}>
          {checkIfEmpty([userCompany.arrAdmin, userCompany.arrAgent, userCompany.arrPending])
            ? <div className={styles.main_empty}>
              <div>B???n ch??a c?? c??ng ty n??o.</div>
              <div>H??y t???o m???i c??ng ty ho???c t??m ki???m v?? tham gia v??o doanh nghi???p</div>
              <button type="button" onClick={() => router.push(routerPathConstant.erCreateEnterprise)}>T???o m???i doanh nghi???p</button>
            </div>
            : <div className={styles.main_inner}>
              <div className={styles.main_action}>
                <div className={styles.main_tab}>
                  <div className={styles.main_overlay} style={{ transform: `translateX(${(tabEnterprise) * 189}px)` }} />
                  <div className={styles.tab_tab} onClick={() => setTabEnterprise(0)}>
                    <span>
                      Doanh nghi???p c???a t??i
                    </span>
                  </div>
                  <div className={styles.tab_tab} onClick={() => setTabEnterprise(1)}>
                    <span>
                      ???? tham gia
                    </span>
                  </div>
                  <div className={styles.tab_tab} onClick={() => setTabEnterprise(2)}>
                    <span>
                      ??ang ch??? duy???t
                    </span>
                  </div>
                </div>
                <div className={styles.main_create}>
                  <button type="button" onClick={() => router.push(routerPathConstant.erCreateEnterprise)}>T???o m???i doanh nghi???p</button>
                </div>
              </div>
              <div className={styles.main_content}>
                {renderEnterprise()}
              </div>
            </div>
          }
        </div>
      </div>

      {detailCompanyModal.id && <ModalPopup
        visible={isDetailCompanyModal}
        handleCancelModal={() => {
          setDetailCompanyModal({})
          setIsDetailCompanyModal(false)
        }}
        closeBtn
        isCancelBtn={false}
        isConfirmBtn={false}
      >
        <div className={styles.modal_company}>
          <div className={styles.header}>
            <img alt="" src={detailCompanyModal.avatar || configConstant.defaultPicture} />
            <div className={styles.name}>{detailCompanyModal.name}</div>
          </div>
          <div className={styles.main}>
            <div className={styles.main_title}>Gi???i thi???u</div>
            <div className={styles.main_item}>
              <img alt="" src="/assets/icons/color/enterprise.svg" />
              <div>T??n doanh nghi???p: </div>
              <div className={styles.main_value}>{detailCompanyModal.name}</div>
            </div>
            <div className={styles.main_item}>
              <img alt="" src="/assets/icons/color/enterprise-1.svg" />
              <div>T??n vi???t t???t: </div>
              <div className={styles.main_value}>{detailCompanyModal.shortName}</div>
            </div>
            <div className={styles.main_item}>
              <img alt="" src="/assets/icons/color/enterprise-2.svg" />
              <div>T??n ng??nh ngh??? kinh doanh: </div>
              <div className={styles.main_value}>{inducstryList.find(inductry => inductry.id === detailCompanyModal.industryId)?.name}</div>
            </div>
          </div>
          {/* <div className={styles.footer}>Qu???n tr??? vi??n</div> */}
          <div className={styles.action}>
            {renderActionEnterEnterprise()}
          </div>
        </div>
      </ModalPopup>}
    </div>
  )
}

export default Enterprise