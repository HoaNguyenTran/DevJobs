
import dynamic from 'next/dynamic';
import React from 'react'
import useWindowDimensions from 'src/hooks/useWindowDimensions';
import Banner from './components/Banner/Banner';
import HotJob from './components/HotJob/HotJob';
import Introduction from './components/Introduction/Introduction';
import styles from "./HomePage.module.scss"


const UrgentJob = dynamic(() => import('./components/UrgentJob/UrgentJob'))
const NewJob = dynamic(() => import('./components/NewJob/NewJob'))
const AroundJob = dynamic(() => import('./components/AroundJob/AroundJob'))
const TopER = dynamic(() => import('./components/TopER/TopER'))
const SliderSmall = dynamic(() => import('./components/SliderSmall/SliderSmall'))
const Blog = dynamic(() => import('./components/Blog/Blog'))
const OutstandingProfessions = dynamic(() => import('./components/OutstandingProfessions/OutstandingProfessions'))
const SuitableJob = dynamic(() => import('./components/SuitableJob/SuitableJob'))



const HomePage = (): JSX.Element => {
  const { width } = useWindowDimensions()
 
  return (
    <div className={styles.homepage}>
      <div className={styles.homepage_wrap}>
        <Banner />
        <TopER />
        <HotJob />
        <SliderSmall />
        <UrgentJob />
        <div className={styles.homepage_slider}>
          <div className={styles.slider_wrap}>
            <img alt="" src={`/assets/images/homepage/slider-large/slider-0${width && width < 675 ? "2" : "1"}.png`} />
          </div>
        </div>
        <NewJob />
        <SuitableJob />
        <AroundJob />
        <OutstandingProfessions />
        <Blog />
        <Introduction />
      </div >
    </div >
  )
}

export default HomePage
