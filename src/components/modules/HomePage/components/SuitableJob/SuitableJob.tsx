import { getSearchNewJobsApi, getSearchSuitableJobsApi } from 'api/client/job'
import React, { useEffect, useRef, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from "./SuitableJob.module.scss"

const SuitableJob = (): JSX.Element => {
  const [suitableJobs, setSuitableJobs] = useState<JobGlobal.Job[]>([])
  const [isLoadingJob, setIsLoadingJob] = useState(false);

  const arrayLoadingRef = useRef([1]);

  const fetchInitData = async () => {
    try {
      setIsLoadingJob(true)
      const { data } = await getSearchNewJobsApi({
        page: 1,
        limit: configConstant.limit.homeSlider,
        sortBy: "matching"
      })
      const tempArray: any = [];
      const total = data?.meta.pagination?.total;
      const jobs = (data.data || []).sort((a: any, b: any) => (b.matching || 0) - (a.matching || 0));
      tempArray.push(...jobs);

      while (tempArray.length < total && tempArray.length !== configConstant.limit.homeAllItemSlider) {
        tempArray.push(data.data[0]);
      }
      setSuitableJobs(tempArray)
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
          sortBy: "matching"
        })
        const tempArray = [...suitableJobs];
        const jobs = (data.data || []).sort((a: any, b: any) => b.matching - a.matching);
        tempArray.splice((page-1)*configConstant.limit.homeSlider, configConstant.limit.homeSlider, ...jobs);
        arrayLoadingRef.current = [...arrayLoadingRef.current, page]
        setSuitableJobs(tempArray) 
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


  return <div className={styles.suitableJob}>
    {suitableJobs.length > 0 && (
      <div className={styles.suitableJob_wrap}>
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              {/* <img src="/assets/icons/color/hot-job.svg" alt="" /> */}
              <span>Việc làm phù hợp với bạn</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.search}?limit=10&page=1&sortBy=matching`}>
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider isLoadingJob={isLoadingJob} beforeChangeSlider={page => beforeChangeSlider(page)} data={suitableJobs} row={4} />
        </div>
      </div>)
    }
  </div>
}

export default SuitableJob