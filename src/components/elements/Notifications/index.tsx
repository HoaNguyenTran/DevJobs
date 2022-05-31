/* eslint-disable react/require-default-props */
import { BellOutlined, CheckOutlined, DeleteOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Badge, Col, Divider, Dropdown, Menu, message, Modal, Row, Skeleton } from 'antd'
import { deleteInAppMessageApi, getMessageInAppApi, getReadAllInAppMessageApi, postReadInAppMessageApi } from 'api/client/notifications'
import moment from 'moment'
import React, { FC, Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch } from 'react-redux'
import { configConstant } from 'src/constants/configConstant'
import { notificationStatus } from 'src/constants/statusConstant'
import { useAppSelector } from 'src/redux'
import { updateInAppAllNotificationMqtt } from 'src/redux/mqtt'
import { handleError } from 'src/utils/helper'
import styles from './Notification.module.scss'


const categoriesNotification = [
  {
    key: "all",
    text: "Tất cả",
    isActive: true
  },
  {
    key: 0,
    text: "Việc làm",
    isActive: false
  },
  {
    key: 1,
    text: "Hệ thống",
    isActive: false
  },
]

interface INotifications {
  bgColor?: string
}

const Notifications: FC<INotifications> = (props) => {
  const { bgColor } = props;
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any>([]);
  const [paramsSearch, setParamsSearch] = useState<any>({ page: 1, limit: configConstant.limit.blogs });
  
  const [categories, setCategories] = useState(categoriesNotification);

  const [isLoadMore, setIsLoadMore] = useState(true)
  const [isFirstShowNoti, setIsFirstShowNoti] = useState(false);
  const [isLoadingNotifcation, setIsLoadingNotification] = useState(true);
  const [countUnreadNotication, setCountUnreadNotification] = useState<number>(0)
  const [isVisiableNotiDetailModal, setIsVisiableNotiDetailModal] = useState(false);

  const [notificationDetail, setNotificationDetail] = useState<any>({});
  const pageRef = useRef(1);
  const dispatch = useDispatch();
  const { mqtt = {} } = useAppSelector(state => state) || {}

  const loadMoreNotification = async (params) => {
    let loadMoreTimeOut:any = null;
     loadMoreTimeOut = setTimeout(async () => {
      try {
        let newNotifications = [
          ...notifications,
        ];
        const ids = newNotifications.map(item => item.id);
        const categoryCurrent: any = categories.find(item => item.isActive) || {};
  
        const tempParamsSearch = { ...params };
        if (categoryCurrent.key === "all") {
          delete tempParamsSearch.jobPostNotify
        } else {
          tempParamsSearch.jobPostNotify = categoryCurrent.key
        }
        const tempPage = pageRef.current + 1;
  
        const { data } = await getMessageInAppApi({
          ...tempParamsSearch,
          page: tempPage
  
        });
  
        pageRef.current = tempPage
  
        data.data.forEach(element => {
          if (!ids.includes(element.id)) {
            newNotifications.push(element)
          }
        });
  
        newNotifications = newNotifications.filter((item: any) => Number(item.msgStatus) !== notificationStatus.deleted);
        setNotifications(newNotifications);
        clearTimeout(loadMoreTimeOut)        
        
        if (!data?.meta?.pagination?.links?.next) {
          setIsLoadMore(false)
        } 
  
      } catch (error) {
        handleError(error)
      } finally {
        setIsLoadingNotification(false);
        setIsFirstShowNoti(true)
      }
    }, 500);
   
  }
  const onClickOptions = (item) => {
    if (document && document.getElementById(`options-menu-dropdown${item.id}`)) {
      (document.getElementById(`options-menu-dropdown${item.id}`) as HTMLInputElement).click()
    }
  }
  const readAllNotfication = async () => {
    try {
      await getReadAllInAppMessageApi();
      message.success("Tất cả các thông báo đã được đánh dấu đọc");
      const newNotifications = notifications.map(element => ({
        ...element,
        msgStatus: notificationStatus.read,
      }))

      setNotifications(newNotifications)

    } catch (e) {
      handleError(e)
    }
  }
  const readAndUpdateNotifications = async (event, item) => {
    // event.stopPropagation();
    // onClickOptions(item);
    try {
      await postReadInAppMessageApi(item.id);
      // update notifications
      const newNotifications = notifications.map(element => ({
        ...element,
        msgStatus: Number(element.id) === Number(item.id) ? notificationStatus.read : element.msgStatus
      }))
      setNotifications(newNotifications)
    } catch (e) {
      handleError(e)
    }
  }
  const openNotiDetailModal = (event, item) => {
    setIsVisiableNotiDetailModal(true);
    setNotificationDetail(item);
    readAndUpdateNotifications(event, item)
  }

  const deleteNotification = async (e, item) => {
    e.stopPropagation();
    onClickOptions(item);
    try {
      await deleteInAppMessageApi(item.id)
      message.success("Xoá thông báo thành công!")
      const newNotifications = notifications.filter(element => Number(element.id) !== Number(item.id))
      setNotifications(newNotifications)
    } catch (error) {
      handleError(error)
    }
  }

  const onClickNotificationIcon = async () => {
    try {
      setCountUnreadNotification(0);
      dispatch(updateInAppAllNotificationMqtt([]))
      if (!isFirstShowNoti) {
        const { data } = await getMessageInAppApi({
          limit: configConstant.limit.notifications,
          page: 1,
        });
        setNotifications(data.data)
      }

    } catch (e) {
      handleError(e)
    } finally {
      setIsLoadingNotification(false);
    }
   
  }

  const onChangeCategory = async (item) => {
    try {
      setIsLoadingNotification(true)
      const tempParams: any = {
        limit: configConstant.limit.notifications,
        page: 1
      }

      if (item.key !== "all") {
        tempParams.jobPostNotify = item.key
      }
      const { data } = await getMessageInAppApi(tempParams);
      
      setNotifications(data.data);
      pageRef.current = 1;
     
      // change active category
      let tempCategories = [...categories];
      tempCategories = tempCategories.map(category => ({
        ...category,
        isActive: category.key === item.key
      }))

      setCategories(tempCategories)
      setIsLoadMore(true)
    } catch (e) {
      handleError(e)
    } finally {
      setIsLoadingNotification(false)
    }
    
  }
 
  const handleNofiticationMQTT = async () => {
    try {
      const categoryCurrent: any = categories.find(item => item.isActive) || {};
      const tempParamsSearch: any = {
        page: 1,
        limit: configConstant.limit.notifications,
      };

      if (categoryCurrent.key !== "all") {
        tempParamsSearch.jobPostNotify = categoryCurrent.key
      } 

      const { data } =  await getMessageInAppApi(tempParamsSearch)
      setNotifications(data.data);
    } catch(e) {
      handleError(e)
    }
      
  }
  useEffect(() => {
    if (mqtt.data.allNotifications.length) {
      handleNofiticationMQTT()

      // count number notifications new and unread
      const countUnReadNotification = mqtt.data.allNotifications.length
      setCountUnreadNotification(countUnReadNotification)
    }
  }, [JSON.stringify(mqtt.data.allNotifications)])

  return (
    <div className={styles.notification}>
      <Badge count={countUnreadNotication} className="badge-notification" offset={[-6, 4]}  >
        <div className={styles.notification} id="fjob-notification">
          <Dropdown
            getPopupContainer={() => document.getElementById('fjob-notification') as HTMLInputElement}
            placement="bottomCenter"
            arrow
            overlay={
              <Menu id='scrollableDiv' 
                style={{
                  width: "350px", 
                  height: "500px", 
                  overflowY: "auto" }} 
                className='p-3'>
                <div className='header font-weight-bold mb-3'>
                  <div className='d-flex align-items-center justify-content-between mb-3'>
                    <div className=''>
                      Thông báo
                    </div>
                    <Dropdown overlay={
                      <Menu key="menu-setting">
                        <Menu.Item key="read-all">
                          <div onClick={readAllNotfication}>
                            <CheckOutlined style={{ color: 'var(--primary-color)' }} /> Đánh dấu tất cả là đã đọc
                          </div>

                        </Menu.Item>
                      </Menu>
                    } placement="bottomCenter" arrow trigger={['click']}>

                      <SettingOutlined className={`cursor-ponter ${styles.settings}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown>
                  </div>

                  <div className='d-flex'>
                    {
                      categories.map(item =>
                        <div key={item.key}>
                          <button className={styles.btn_category} style={
                            item.isActive ? { background: "var(--secondary-color)", color: "white" } : {}
                          } type='button' onClick={() => onChangeCategory(item)}>{item.text}</button>
                        </div>
                      )
                    }
                  </div>


                </div>
                <Divider className='my-2' />
                {
                  notifications.length ?
                    <>
                      {
                        isLoadingNotifcation ?
                          <div className='text-center mt-2'>
                            <Skeleton avatar paragraph={{ rows: 4 }} />
                            <Skeleton avatar paragraph={{ rows: 4 }} className='mt-2' />
                          </div> :
                          <InfiniteScroll
                            dataLength={notifications.length}
                            next={() => loadMoreNotification(paramsSearch)
                              // useDebounceFunction(loadMoreNotification, 500)
                            }
                            hasMore={isLoadMore}
                            loader={
                              <Skeleton avatar paragraph={{ rows: 4 }} />
                            }
                            // scrollThreshold={0.7}
                            // height={500}
                            scrollableTarget="scrollableDiv"
                          >
                            {
                              notifications.map((item: any, index) =>
                                <Fragment key={index}>
                                  <Menu.Item key={index} onClick={(e) => openNotiDetailModal(e, item)}>
                                    <Row>
                                      <Col span={3}>
                                        <Avatar style={{ minWidth: '32px' }} icon={<BellOutlined style={{ fontSize: "1.25rem" }} />} className='mr-2 d-flex align-items-center justify-content-center' />
                                      </Col>
                                      <Col span={18} className={`pl-1 ${Number(item.msgStatus) === notificationStatus.unread ? styles.unreadNotification : ''}`
                                      }>
                                        <div className={styles.formatString}>
                                          {item.title || ""}
                                        </div>
                                        {/* <div className={`${styles.formatString} mt-2`} style={{ fontSize: "14px" }}>
                                        {item.detail || ""}
                                      </div> */}
                                        <div className={`${Number(item.msgStatus) === notificationStatus.unread ? 'font-weight-bold' : ''} text-right d-flex align-items-center mt-2`}
                                          style={{ fontSize: "14px" }}>
                                          <img className='mr-1' src='/assets/icons/color/time.png' alt='icon-time' />
                                          {moment(item.updatedAt).fromNow()}
                                        </div>
                                      </Col>
                                      <Col span={2} className={styles.options}>
                                        <Dropdown className='options' overlay={
                                          <Menu>
                                            <Menu.Item key="delete">
                                              <div onClick={(e: any) => {
                                                deleteNotification(e, item)
                                              }}>
                                                <DeleteOutlined style={{ color: 'var(--primary-color)' }} />
                                                &nbsp; Xoá thông báo
                                              </div>

                                            </Menu.Item>
                                            {
                                              Number(item.msgStatus) !== notificationStatus.read &&
                                              <Menu.Item key="read">
                                                <div onClick={(e: any) => {
                                                  e.stopPropagation()
                                                  onClickOptions(item)
                                                  readAndUpdateNotifications(e, item);
                                                }}>
                                                  <CheckOutlined style={{ color: 'var(--primary-color)' }} />
                                                  &nbsp; Đánh dấu là đã đọc
                                                </div>
                                              </Menu.Item>
                                            }

                                          </Menu>
                                        } placement="bottomCenter" arrow trigger={['click']} >
                                          <EllipsisOutlined id={`options-menu-dropdown${item.id}`} onClick={e => {
                                            // e.preventDefault();
                                            e.stopPropagation();
                                            // toggleVisiableMenu();
                                          }} />
                                        </Dropdown>

                                      </Col>
                                    </Row>

                                  </Menu.Item>
                                  <Menu.Divider className={`${index !== notifications.length - 1 ? "d-block" : "d-none"} my-2`} />
                                </Fragment>
                              )
                            }
                          </InfiniteScroll>
                      }
                    </> :
                  <div className='text-center'>{t('common.noData')}</div>
                }
              </Menu>
            }
            trigger={['click']}>
            <div className={`${styles.circleNoti} cursor-pointer`} style={{ background: bgColor ? "var(--secondary-color)" : "#8f30d6" }} onClick={() => {
              onClickNotificationIcon()

            }}>
              <BellOutlined style={{ fontSize: '1.5rem', color: 'white' }} className='cursor-pointer' />
            </div>
          </Dropdown>
        </div>
      </Badge>
      <Modal
        onCancel={() => setIsVisiableNotiDetailModal(false)}
        visible={isVisiableNotiDetailModal}
        width={500}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">Chi tiết thông báo</div>
          <div className='mt-5 d-flex align-items-center'>
            <Avatar style={{ minWidth: '32px' }} icon={<BellOutlined style={{ fontSize: "1.25rem" }} />} className='mr-2 d-flex align-items-center justify-content-center' />
            <span className='font-weight-bold'>{notificationDetail.title || ""}</span>
          </div>
          <div className='mt-3'>
            {notificationDetail.detail || ""}
          </div>
          <div className='mt-3 text-right d-flex align-items-center justify-content-end'>
            <img className='mr-1' src='/assets/icons/color/time.png' alt='icon-time'  />
            {moment(notificationDetail.updatedAt).format(configConstant.displayTime.DDMMYYYHHmmss)}
          </div>
        </div>
      </Modal>
    </div>


  )
}
export default Notifications;