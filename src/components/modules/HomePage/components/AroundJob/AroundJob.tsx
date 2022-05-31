import { getSearchAroundJobsByLocationApi, getSearchNewJobsApi } from 'api/client/job'
import React, { useEffect, useRef, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import { handleError } from 'src/utils/helper'
import styles from "./AroundJob.module.scss"

const AroundJob = (): JSX.Element => {

  const [aroundJobs, setAroundJobs] = useState<JobGlobal.Job[]>([])

  const profile = useAppSelector(state => state?.user?.profile || {})
  const { latitude, longitude } = (profile.addresses || []).find(address => address.main === 1) || {}

  const [isLoadingJob, setIsLoadingJob] = useState(false);

  const arrayLoadingRef = useRef([1]);

  const fetchInitData = async () => {
    try {
      setIsLoadingJob(true)
      const { data } = await getSearchNewJobsApi({
        page: 1,
        limit: configConstant.limit.homeSlider,
        locationType: 1,
        latitude: latitude || 0,
        longitude: longitude || 0,
        distance: 10000
      })
      const tempArray: any = [];
      const total = data?.meta.pagination?.total;
      tempArray.push(...data.data);

      while (tempArray.length < total && tempArray.length !== configConstant.limit.homeAllItemSlider) {
        tempArray.push(data.data[0]);
      }
      setAroundJobs(tempArray)
    }
    catch (error) {
      handleError(error, { isIgnoredMessage: true })
    } finally {
      setIsLoadingJob(false)
    }
  }
  const beforeChangeSlider = async (page) => {
    try {
      if(!arrayLoadingRef.current.includes(page)) {
        setIsLoadingJob(true)
        const { data } = await getSearchNewJobsApi({
          page,
          limit: configConstant.limit.homeSlider,
          locationType: 1,
          latitude: latitude || 0,
          longitude:longitude || 0,
          distance: 10000
        })
        const tempArray = [...aroundJobs];
        const jobs = data.data;
        tempArray.splice((page-1)*configConstant.limit.homeSlider, configConstant.limit.homeSlider, ...jobs);
        arrayLoadingRef.current = [...arrayLoadingRef.current, page]
        setAroundJobs(tempArray)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoadingJob(false)
    }
  }

  useEffect(() => {
    if (latitude && longitude) {
      fetchInitData()
    }
  }, [])

  if (!latitude || !longitude) return <></>

  return <div className={styles.aroundJob}>
    {aroundJobs.length > 0 && (
      <div className={styles.aroundJob_wrap}>
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              {/* <img src="/assets/icons/color/hot-job.svg" alt="" /> */}
              <span>Việc làm Gần Bạn</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.suitableDistance}`} target="_blank">
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider isLoadingJob={isLoadingJob} beforeChangeSlider={page => beforeChangeSlider(page)} flag="aroundJob" data={aroundJobs} row={4} />
        </div>
      </div>
    )
    }
  </div>

}

export default AroundJob