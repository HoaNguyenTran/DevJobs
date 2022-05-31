import { getMessageInAppApi } from 'api/client/notifications'
import React, { useEffect, useState } from 'react'
import { handleError } from 'src/utils/helper'
import moment from 'moment'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import styles from "./Notify.module.scss"

const Notify = (): JSX.Element => {
  const [personMessage, setPersonMessage] = useState<any[]>([])
  const [globalMessage, setGlobalMessage] = useState<any[]>([])

  const { width } = useWindowDimensions()

  const [tab, setTab] = useState(1)

  const fetchDataNotify = async () => {
    try {
      const { data } = await getMessageInAppApi({ page: 1, limit: 100 })
      setPersonMessage(data.data?.filter(item => item.msgType === 1))
      setGlobalMessage(data.data?.filter(item => item.msgType === 0))
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }

  useEffect(() => {
    fetchDataNotify()
    return () => {
      setPersonMessage([])
      setGlobalMessage([])
    };
  }, [])

  if (width && width < 480) return (
    <div className={styles.notify}>
      <div>
        <button type="button" onClick={() => setTab(1)}
          style={tab === 1 ? { background: "#E7E7E7", fontWeight: "600" } : { background: "#F9F9F9", fontWeight: "500" }}
          className={styles.message}>Thông báo việc làm</button>
        <button type="button" onClick={() => setTab(2)}
          style={tab === 2 ? { background: "#E7E7E7", fontWeight: "600" } : { background: "#F9F9F9", fontWeight: "500" }}
          className={styles.message}>Có thể bạn quan tâm</button>
      </div>
      <div>
        {tab === 1 && <div className={styles.person}>
          <div className={styles.content}>
            {personMessage.length
              ? personMessage.map(notify => <div key={notify.id} className={styles.item}>
                <div className={styles.title}>{notify.title}</div>
                <div className={styles.subtitle}>{notify.detail}</div>
                <div className={styles.time}><img alt="" src="/assets/icons/default/time.svg" />&nbsp;
                  {moment(notify.updatedAt).fromNow()}</div>
              </div>)
              : <div className={styles.empty}>Không có thông báo nào!</div>
            }
          </div>
        </div>}
        {tab === 2 && <div className={styles.global}>
          <div className={styles.content}>
            {globalMessage.length
              ? globalMessage.map(notify => <div key={notify.id} className={styles.item}>
                <div className={styles.title}>{notify.title}</div>
                <div className={styles.subtitle}>{notify.detail}</div>
                <div className={styles.time}><img alt="" src="/assets/icons/default/time.svg" />&nbsp;
                  {moment(notify.updatedAt).fromNow()}
                </div>
              </div>)
              : <div className={styles.empty}>Không có thông báo nào!</div>
            }
          </div>
        </div>}
      </div>
    </div>
  )

  return (
    <div className={styles.notify}>
      <div className={styles.person}>
        <div className={styles.message}>Thông báo việc làm</div>
        <div className={styles.content}>
          {personMessage.length
            ? personMessage.map(notify => <div key={notify.id} className={styles.item}>
              <div className={styles.title}>{notify.title}</div>
              <div className={styles.subtitle}>{notify.detail}</div>
              <div className={styles.time}><img alt="" src="/assets/icons/default/time.svg" />&nbsp;
                {moment(notify.updatedAt).fromNow()}</div>
            </div>)
            : <div className={styles.empty}>Không có thông báo nào!</div>
          }
        </div>
      </div>
      <div className={styles.global}>
        <div className={styles.message}>Có thể bạn quan tâm</div>
        <div className={styles.content}>
          {globalMessage.length
            ? globalMessage.map(notify => <div key={notify.id} className={styles.item}>
              <div className={styles.title}>{notify.title}</div>
              <div className={styles.subtitle}>{notify.detail}</div>
              <div className={styles.time}><img alt="" src="/assets/icons/default/time.svg" />&nbsp;
                {moment(notify.updatedAt).fromNow()}
              </div>
            </div>)
            : <div className={styles.empty}>Không có thông báo nào!</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Notify