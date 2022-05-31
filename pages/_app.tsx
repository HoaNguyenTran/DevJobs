import 'src/styles/index.scss';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
// import enUS from 'antd/lib/locale/en_US';
import 'moment/locale/vi';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Provider, useStore } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import Layout from 'src/components/layouts/Layout/Layout';
import HookMqtt from 'src/components/modules/CreateUrgentJob/MQTT';
import { configConstant } from 'src/constants/configConstant';
import { wrapper } from 'src/redux';
import 'src/styles/common/themeAntd.less';
import SEO from 'src/components/elements/SEO';
import 'src/i18n';
import { MessengerChat } from 'react-messenger-chat-plugin';
import { isServer } from 'src/utils/helper';

const TopProgressBar = dynamic(() => import('src/components/elements/TopProgressBar'), { ssr: false })

export default wrapper.withRedux(({ Component, pageProps }) => {
  const store = useStore()
  const router = useRouter()

  if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.production) {
    useEffect(() => {
      import('react-facebook-pixel')
        .then(x => x.default)
        .then(ReactPixel => {
          ReactPixel.init(`${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}`)
          ReactPixel.pageView()

          router.events.on('routeChangeComplete', () => {
            ReactPixel.pageView()
          })
        })
    }, [router.events])
  }

  if (isServer()) {
    return (
      <>
        <SEO />
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </>
    )
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)} loading={null}>
        <ConfigProvider locale={viVN}>
          <Layout>
            <SEO />
            <TopProgressBar />
            <HookMqtt />
            <Component {...pageProps} />
            {process.env.NEXT_PUBLIC_WEB_ENV !== configConstant.environment.development &&
              <MessengerChat
              pageId="114683634053624"
              language="vi_VN"
              themeColor="#ff8500"
              loggedInGreeting="Bắt đầu cuộc trò chuyện với chúng tôi để được hỗ trợ nhanh nhất!"
              loggedOutGreeting="Bắt đầu cuộc trò chuyện với chúng tôi để được hỗ trợ nhanh nhất!"
            // greetingDialogDisplay="show"
            // debugMode
            />}
          </Layout>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  )
})
