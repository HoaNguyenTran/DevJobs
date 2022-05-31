import { getSearchHotJobsApi, getSearchNewJobsApi } from 'api/client/job'
import React, { useEffect, useRef, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from "./HotJob.module.scss"

const HotJob = (): JSX.Element => {
  const [hotJobs, setHotJobs] = useState<JobGlobal.Job[]>([])
  const [isLoadingJob, setIsLoadingJob] = useState(false);

  const arrayLoadingRef = useRef([1]);

  const fetchInitData = async () => {
    try {
      setIsLoadingJob(true)
      const { data } = await getSearchNewJobsApi({
        page: 1,
        limit: configConstant.limit.homeSlider,
        isHotJob: 1,
      })
      const tempArray: any = [];
      const total = data?.meta.pagination?.total;
      tempArray.push(...data.data);

      while (tempArray.length < total && tempArray.length !== configConstant.limit.homeAllItemSlider) {
        tempArray.push(data.data[0]);
      }
      setHotJobs(tempArray)
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
          isHotJob: 1,
        })
        const tempArray = [...hotJobs];
        const jobs = data.data;
        tempArray.splice((page-1)*configConstant.limit.homeSlider, configConstant.limit.homeSlider, ...jobs);
        arrayLoadingRef.current = [...arrayLoadingRef.current, page]
        setHotJobs(tempArray)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoadingJob(false)
    }
  }
  useEffect(() => {
    fetchInitData()
  }, [])


  return <div className={styles.hotJob}>
    {hotJobs.length > 0 && (
      <div className={styles.hotJob_wrap}>
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              <img src="/assets/icons/color/hot-job.svg" alt="" />
              <span>Việc làm Siêu Hot</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.search}?limit=10&page=1&isHotJob=1`}>
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider isLoadingJob={isLoadingJob} beforeChangeSlider={page => beforeChangeSlider(page)} flag='isHotJob' data={hotJobs} row={4} />
        </div>
      </div>)
    }
  </div>
}

export default HotJob