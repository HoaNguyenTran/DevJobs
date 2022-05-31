import { getSearchNewJobsApi, getSearchUrgentJobsApi } from 'api/client/job'
import React, { FC, useEffect, useRef, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from "./UrgentJob.module.scss"

const UrgentJob: FC = () => {
  const [urgentJobs, setUrgentJobs] = useState<JobGlobal.Job[]>([])
  const [isLoadingJob, setIsLoadingJob] = useState(false);

  const arrayLoadingRef = useRef([1]);

  const fetchInitData = async () => {
    try {
      setIsLoadingJob(true)
      const { data } = await getSearchNewJobsApi({
        page: 1,
        limit: configConstant.limit.homeSlider,
        urgent: 1,
      })
      const tempArray: any = [];
      const total = data?.meta.pagination?.total;
      tempArray.push(...data.data);

      while (tempArray.length < total && tempArray.length !== configConstant.limit.homeAllItemSlider) {
        tempArray.push(data.data[0]);
      }
      setUrgentJobs(tempArray)
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
          urgent: 1,
        })
        const tempArray = [...urgentJobs];
        const jobs = data.data;
        tempArray.splice((page-1)*configConstant.limit.homeSlider, configConstant.limit.homeSlider, ...jobs);
        arrayLoadingRef.current = [...arrayLoadingRef.current, page]
        setUrgentJobs(tempArray)
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

  return <div className={styles.urgentJob}>
    <div className={styles.urgentJob_wrap}>
      {urgentJobs.length > 0 && (
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              <img src="/assets/icons/color/urgent-job.svg" alt="" />
              <span>Việc làm Siêu Gấp</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.search}?limit=10&page=1&urgent=1`}>
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider isLoadingJob={isLoadingJob} beforeChangeSlider={page => beforeChangeSlider(page)} flag="urgent" data={urgentJobs} row={4} />
        </div>)
      }
    </div>
  </div>
}

export default UrgentJob