/* eslint-disable react/require-default-props */
// need rafactor
import { WarningOutlined } from '@ant-design/icons'

import { Alert } from 'antd'
import { getVersionCodeApi } from 'api/client/initData'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Footer from 'src/components/elements/Footer/Footer'
import Header from 'src/components/elements/Header/Header'
import HeaderEE from 'src/components/elements/Header/HeaderEE/HeaderEE'
import HeaderER from 'src/components/elements/Header/HeaderER/HeaderER'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { configConstant } from 'src/constants/configConstant'
import { firebaseAnalytics } from 'src/constants/firebaseAnalyticsConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getInitDataRequest, getVersionCodeRequest } from 'src/redux/initData/actions'
import { getLogoutRequest, getProfileRequest } from 'src/redux/user'
import { firebase } from 'src/utils/firebase'
import { dectectDeviceType, getMobileOperatingSystem, handleError, isServer } from 'src/utils/helper'
import { getAccessTokenCookieCSR, getUserRoleCookieCSR, removeCookieCSR, removeLocalStorageWhenLogout } from 'src/utils/storage'

import styles from './Layout.module.scss'

const pageUnLayout = [
  routerPathConstant.signIn,
  routerPathConstant.signUp,
  routerPathConstant.forgotPass,
]

const Layout = ({ children }): JSX.Element => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { initData } = useAppSelector(state => state)
  const  profile  = useAppSelector(state => state.user?.profile || {} )

  const [isVisibleRedirectBrowserModalAndroid, setIsVisibleRedirectBrowserModalAndroid] = useState(false)
  const [isAlertOnMobile, setIsAlertOnMobile] = useState(false);
  const [isWebviewFB, setIsWebviewFB] = useState(false);
 

  const handleOpenAppFromBrowser = () => {
    setTimeout(() => {
      if (getMobileOperatingSystem() === configConstant.mobileOS.iOS.key) {
        firebase.analytics().logEvent(firebaseAnalytics.downloadIOS)
        window.location.href = configConstant.mobileOS.iOS.linkDownload
      }
      if (getMobileOperatingSystem() === configConstant.mobileOS.android.key) {
        firebase.analytics().logEvent(firebaseAnalytics.downloadAndroid)
        window.location.href = configConstant.mobileOS.android.linkDownload
      }
    }, 25)
    if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.production)
      window.location.href = configConstant.mobileDomain.Production
    if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.staging)
      window.location.href = configConstant.mobileDomain.Staging
  }

  // Check version code
  const fetchVersionCode = async () => {
    try {
      const resVersion = await getVersionCodeApi()
      dispatch(getInitDataRequest())
      if (!initData.code || !initData.data || initData.code !== resVersion.data.data) {
        dispatch(getInitDataRequest())
        dispatch(getVersionCodeRequest())
      }
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }

  const redirectOnBrowserIOS = () => {
    const urlWithoutProtocol = `${window.location.host}/${window.location.pathname}${window.location.search}`;
    try {
      // window.location.href = `googlechrome://${urlWithoutProtocol}`
      window.open(`googlechrome://${urlWithoutProtocol}`, "_self")
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        window.open(`firefox://open-url?url=${window.location.href}`, "_self")
        // window.location.href = `firefox://open-url?url=${window.location.href}`
      }, 200);
      setTimeout(() => {
        window.open(`touch-http://${urlWithoutProtocol}`, "_self")
        // window.location.href = `touch-http://${urlWithoutProtocol}`

      }, 300);
    }
  }
  const detectBrowserOnDevices = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const opera = /Opera|OPR|Opera Mini|opt/.test(userAgent);
    const safari = /safari/.test(userAgent);
    const ios = /iphone|ipod|ipad/.test(userAgent);
    const appFb = /fban/.test(userAgent);
    const messengerFbForIOS = /messenger/.test(userAgent);

    const standalone = (window.navigator as any)?.standalone;
    if (ios) {
      if (!standalone && !opera && !safari) {
        if (appFb && !messengerFbForIOS) {
          setIsWebviewFB(true)
        }
        setIsAlertOnMobile(true);
        redirectOnBrowserIOS()
      }

    } else if (userAgent.includes('wv')) {
      // Android webview
      setIsVisibleRedirectBrowserModalAndroid(true)
      return true
    }
    return false
  }
  const openBrowserAndroid = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('wv')) { // check webview android
      window.open(`intent:${window.location.href}#Intent;end`, "_self");
    }
  };



  useEffect(() => {
    fetchVersionCode()

    // case: avoid un-authenticate (no data 1 in 2 AccessToken or userCode)
    if (Boolean(getAccessTokenCookieCSR()) !== Boolean(localStorage.getItem(storageConstant.localStorage.userCode))) {
      router.push(routerPathConstant.signIn)

      dispatch(getLogoutRequest())
      removeLocalStorageWhenLogout()

      removeCookieCSR(storageConstant.cookie.accessToken)
      removeCookieCSR(storageConstant.cookie.userRole)
    }

    if (getAccessTokenCookieCSR() && localStorage.getItem(storageConstant.localStorage.userCode)) {
      dispatch(getProfileRequest({ userCode: localStorage.getItem(storageConstant.localStorage.userCode) || "" }))
    }
    detectBrowserOnDevices()
  }, [])




  const renderLayout = () => {
    if (getAccessTokenCookieCSR())
      return (<>
        {getUserRoleCookieCSR() === roleConstant.EE.name ? <HeaderEE /> : <HeaderER />}
        <main className={styles.layout_main}>{children}</main>
        {getUserRoleCookieCSR() === roleConstant.EE.name && <Footer />}
      </>)

    return (<>
      <Header />
      <main className={styles.layout_main}>{children}</main>
      <Footer />
    </>)
  }

  return (
    <div className={styles.layout}>
      {profile?.code && profile?.censorship === 4 && <Alert message={
        <div>M??n h??? s?? c?? nh??n ch???a n???i dung kh??ng ph?? h???p. Vui l??ng s???a l???i!</div>
      }
        type="error"
        icon={<WarningOutlined />}
        showIcon
        closable
      />}
      {pageUnLayout.includes(router.pathname) ?
        <>{children}</> :
        renderLayout()
      }
      {
        !isServer() &&
        dectectDeviceType() === configConstant.device.mobile &&
        (
          <div className={`${styles.layout_app}`}>
            <div className={`${styles.layout_app_inner} custom-alert`}>
              <Alert message={
                <a onClick={handleOpenAppFromBrowser}>
                  D??ng ???ng d???ng
                </a>
              } type="success" closable />
              {
                isAlertOnMobile &&
                <Alert className={
                  isWebviewFB ?
                    styles.warningAlertBrowser
                    : ""
                }
                  message={
                    <span>
                      B???n h??y m??? tr??nh duy???t ho???c s??? d???ng app ????? tr???i nghi???m t???t nh???t
                    </span>
                  }
                  description={
                    isWebviewFB &&
                    <div className='text-left mt-3'>
                      <div>
                        <div>B?????c 1: Nh???n v??o n??t <img src='/assets/images/guide/options.png' alt='options' className={styles.optionsImage} /> ??? g??c m??n h??nh</div>
                        <div>B?????c 2: Nh???n v??o &quot;M??? trong tr??nh duy???t&quot; (nh?? h??nh b??n d?????i)</div>
                        <img src='/assets/images/guide/tour_guide.png' alt='options menu' className={`${styles.optionsMenu}`} />
                      </div>
                    </div>
                  }
                  type="warning" closable />
              }
            </div>
          </div>
        )}

      <ModalPopup
        handleConfirmModal={() => {
          openBrowserAndroid()
        }}
        title='Th??ng b??o'
        visible={isVisibleRedirectBrowserModalAndroid}
        isCancelBtn={false}
      >
        <div>
          B???n c???n m??? tr??nh duy???t m???c ?????nh tr??n ??i???n tho???i ????? ???????c tr???i nghi???m t???t nh???t.
        </div>
      </ModalPopup>
    </div>
  )
}

export default Layout
