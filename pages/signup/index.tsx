import { Image } from 'antd'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { setCookie } from 'nookies'
import React, { FC, useEffect, useState } from 'react'
import StepOneSignUp from 'src/components/modules/SignUp/step1'
import StepTwoSignUp from 'src/components/modules/SignUp/step2'
import StepFourSignUp from 'src/components/modules/SignUp/step4'
import StepFiveSignUp from 'src/components/modules/SignUp/step5'
import StepSixSignUp from 'src/components/modules/SignUp/step6'
import StepSevenSignUp from 'src/components/modules/SignUp/step7'
import StepEightSignUp from 'src/components/modules/SignUp/step8'
import StepNineSignUp from 'src/components/modules/SignUp/step9'
import { configConstant } from 'src/constants/configConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { getUserRoleCookieCSR, setUserRoleCookieCSR } from 'src/utils/storage'
import styles from './Signup.module.scss'



const SignUpPage: FC = () => {
  const router = useRouter();
  const rawInfoStep =
    typeof window !== 'undefined' ? localStorage.getItem(storageConstant.localStorage.signupProcess) : '{}'
  const stepInfo = rawInfoStep && JSON.parse(rawInfoStep)

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [role, setRole] = useState(router.query.role || getUserRoleCookieCSR() || roleConstant.EE.name)

  const getCurrentStep = (step: number) => {
    setCurrentStep(step)
  }
  

  const renderStepSignup = () => {
    switch (currentStep) {
      case 1:
        return <StepOneSignUp getCurrentStep={getCurrentStep} />
      case 2:
        return <StepTwoSignUp getCurrentStep={getCurrentStep} />
      case 3:
      case 4:
        return <StepFourSignUp getCurrentStep={getCurrentStep} />
      case 5:
        return <StepFiveSignUp getCurrentStep={getCurrentStep} />
      case 6:
        return <StepSixSignUp />
      case 7:
        return <StepSevenSignUp getCurrentStep={getCurrentStep} />
      case 8:
        return <StepEightSignUp getCurrentStep={getCurrentStep} />
      case 9:
        return <StepNineSignUp getCurrentStep={getCurrentStep} />
      default:
        break
    }
  }
  
  const onClickLogo = () => {
    router.push("/")
  }

  useEffect(() => {
    if (stepInfo) {
      if (!stepInfo.status) {
        if (stepInfo.step === 2) {
          getCurrentStep(1)
        } else {
          getCurrentStep(stepInfo.step)
        }
      } else {
        router.replace('/')
      }
    }
  }, [])

  useEffect(() => {
    if(router.query.fromCampaign) {
      setCookie(null, storageConstant.cookie.fromCampaign, router.query.fromCampaign?.toString(), {
        maxAge: 0.5 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === configConstant.environment.production,
      })
    }
    if(router.query.role) {
      const signupProcess:any = localStorage.getItem(storageConstant.localStorage.signupProcess);
      
      let obj = JSON.parse(signupProcess || "{}");
      if(Object.keys(obj).length) {

        obj = {
          status: Number(obj.status),
          step: Number(obj.step),
          role: router.query.role
        }

      } else {
        obj = {
          status: 0,
          step: 1,
          role: router.query.role
        }
          
      }
      localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(obj))
      setUserRoleCookieCSR({ role: router.query.role })
      setRole(router.query.role)
    }
  },[router.query])

  return (
    <>
      <NextSeo title="Đăng kí" description="Đăng kí" />
      <div className={`signup ${styles.main}`}>
        <div className={styles.main_img} style={
          role === roleConstant.EE.name ? 
          { backgroundImage: "url(/assets/images/banners/EE.jpg)"}
          :
          { backgroundImage: "url(/assets/images/banners/ER.jpg)" }
          } 
          />
        <div className={styles.main_wrap}>
          <div className={styles.main_wrap_banner} onClick={onClickLogo}>
            <Image
              preview={false}
              height={97}
              width={190.4}
              src="/assets/images/logo/logo.svg"
              alt="logo"
            />
            <span>Nền tảng cung cấp việc làm cho thế hệ trẻ</span>
          </div>
         
          {renderStepSignup()}
         
         
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  return { props: {} }
}

export default SignUpPage