import { LeftOutlined, DeleteTwoTone, CloseCircleFilled } from '@ant-design/icons';
import { Cascader, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { postCreateNewCompanyApi, postSaveAddressCompanyApi } from 'api/client/company';
import { patchUpdateUserApi } from 'api/client/user'
import router from 'next/router';
import React, { useState, useEffect } from 'react'
import Map from 'src/components/elements/Map/Map';
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup';
import { configConstant } from 'src/constants/configConstant';
import { routerPathConstant } from 'src/constants/routerConstant';
import { useAppSelector } from 'src/redux';
import { checkPhoneNumber, createCategories, getEmbedLinkYoutube, getQueryString, handleError, matchYoutubeUrl, } from 'src/utils/helper';
import UploadAvatar from '../components/UploadAvatar/UploadAvatar';
import UploadMultiPicture from '../components/UploadMultiPicture/UploadMultiPicture';
import styles from "./CreateEnterprise.module.scss"

const CreateEnterprise = (): JSX.Element => {
  const masterData = useAppSelector(state => state.initData.data) 
  const categoryList = createCategories(masterData.FjobCategory)
  const profile = useAppSelector(state => state.user.profile || {})
  const [form] = Form.useForm();

  const [avatar, setAvatar] = useState(configConstant.defaultCirclePicture)

  const [addressEnterprise, setAddressEnterprise] = useState<any>([])


  const [pictureCertificate, setPictureCertificate] = useState<any>([])
  const [pictureIntro, setPictureIntro] = useState<any>([])

  const [isAddAddressModal, setIsAddAddressModal] = useState(false)


  const handleAddPictureCertificate = (imgUrl) => {
    setPictureCertificate([...pictureCertificate, imgUrl])
  }

  const handleAddPictureIntro = (imgUrl) => {
    setPictureIntro([...pictureIntro, imgUrl])
  }


  const handlePostAddress = async data => {
    form.setFieldsValue({ address: [...addressEnterprise, data] })
    setAddressEnterprise([...addressEnterprise, data])
  }

  const renderAddressEnterprise = addressEnterprise.map((address, index) => (
    <div key={index} className={styles.main_address_item}>
      <span>
        {index + 1}. {address.address}
      </span>
      <DeleteTwoTone
        onClick={() => {
          form.setFieldsValue({ address: addressEnterprise.filter(item => item.address !== address.address) })
          setAddressEnterprise(addressEnterprise.filter(item => item.address !== address.address))
        }}
        twoToneColor="red"
      />
    </div>
  ))

  const handleFinishCreateEnterprise = async (values) => {
    try {
      if (!checkPhoneNumber(String(values.phoneNumber).trim()))
        return message.error("S??? ??i???n tho???i kh??ng ????ng!")
      if (values.introLink  && !matchYoutubeUrl(values.introLink)) {
         message.error("Sai link youtube!");
         return;
      }
      const arr: any = []

      pictureCertificate.forEach(picture => {
        if (picture !== configConstant.defaultPicture) arr.push({ image: picture, type: 1 })
      })
      pictureIntro.forEach(picture => {
        if (picture !== configConstant.defaultPicture) arr.push({ image: picture, type: 2 })
      })

      let videoCode = ""; 

      if(values.introLink) {
        const tempArraySearch =  values.introLink?.split("?");
        const urlSearchParams = new URLSearchParams(`?${tempArraySearch[1]}`);
        const params = Object.fromEntries(urlSearchParams.entries())
        videoCode = params.v;
      }

      const { data } = await postCreateNewCompanyApi({
        name: values.fullName,
        shortName: values.shortName,
        contactPhone: String(values.phoneNumber),
        website: values.website,
        email: values.email,
        numEmployee: values.scale,
        industryId: Number(values.career),
        desc: values.introduction,
        isVerified: 0,
        parentId: 0,
        avatar,
        imagesJson: JSON.stringify(arr),
        introLink: videoCode
      })

      const formatAddress = Array.from(addressEnterprise.map(item => ({ ...item, companyId: data.id })))

      Promise.all(formatAddress.map(item => postSaveAddressCompanyApi(item)))
        .then()
        .catch(error => {
          handleError(error)
        })

      // dispatch(getUserCompanyRequest())
      message.success("T???o c??ng ty th??nh c??ng!")
      
      setTimeout(() => {
        router.push(routerPathConstant.erEnterprise)
      }, 400);

    } catch (e) {
      handleError(e)
    }
  }


  return (
    <div className={`enterprise ${styles.enterprise}`}>
      <div className={styles.enterprise_wrap}>
        <div className={styles.enterprise_back} onClick={() => router.back()}><LeftOutlined /> Quay l???i</div>
        <div className={styles.enterprise_header}>
          <div className={styles.header_inner}>
            <div className={styles.header_title}>T???o m???i doanh nghi???p</div>
            <div className={`${styles.header_avatar  } cursor-pointer`}>
              {/* <div> */}
              <UploadAvatar avatar={avatar} setAvatar={(link) => setAvatar(link)} />
              <img alt="" src="/assets/icons/default/camera.svg" className={styles.header_avatar_icon}  />
              {/* <div className={styles.header_photo}>
                <img alt="" src="/assets/icons/default/photo.svg" />
              </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className={styles.enterprise_main}>
          <Form
            form={form}
            onFinish={handleFinishCreateEnterprise}
            layout="vertical"
            scrollToFirstError
          >
            <Row gutter={28}>
              <Col span={16}>
                <Form.Item
                  name="fullName"
                  label="T??n doanh nghi???p"
                  rules={[
                    {
                      required: true,
                      message: 'T??n doanh nghi???p kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <Input placeholder='Nh???p t??n doanh nghi???p c???a b???n' maxLength={200}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="shortName"
                  label="T??n vi???t t???t"
                >
                  <Input placeholder='T??n vi???t t???t' maxLength={200} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={28}>
              <Col span={8}>
                <Form.Item
                  name="phoneNumber"
                  label="S??? ??i???n tho???i"
                  rules={[
                    {
                      required: true,
                      message: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <InputNumber placeholder='Nh???p s??? ??i???n tho???i c???a c??ng ty' controls={false} maxLength={200} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Email kh??ng ???????c ????? tr???ng!',
                    // },
                    {
                      type: 'email',
                      message: 'Ph???i l?? ?????nh d???ng email!',
                    },
                  ]}
                >
                  <Input placeholder='Nh???p email c???a c??ng ty'  maxLength={200} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="website"
                  label="Website"
                >
                  <Input placeholder='Nh???p website c???a c??ng ty'  maxLength={200} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={28}>
              <Col span={16}>
                <Form.Item
                  name="career"
                  label="L??nh v???c"
                  rules={[
                    {
                      required: true,
                      message: '?????a ch??? l??m vi???c kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <Select placeholder="L??nh v???c ho???t ?????ng">
                    {(masterData.FjobIndustry || []).map(inductry => <Select.Option key={inductry.id} value={inductry.id}>
                      {inductry.name}
                    </Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="scale"
                  label="Quy m??"
                  rules={[
                    {
                      required: true,
                      message: 'Quy m?? c??ng ty kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <InputNumber placeholder='Nh???p quy m?? c??ng ty' controls={false}  maxLength={200} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="address"
              label="?????a ch??? l??m vi???c"
              rules={[
                {
                  required: true,
                  message: "C???n ??t nh???t 1 ?????a ch??? l??m vi???c!"
                },
              ]}
            >
              {renderAddressEnterprise}
            </Form.Item>

            {addressEnterprise.length < 5 && <button type="button" className={styles.address_btn}
              onClick={() => setIsAddAddressModal(true)}>
              <span>Th??m ?????a ch???</span>
            </button>}

            <div style={{ fontWeight: 500, marginTop: ".75rem" }}>Gi???y ph??p kinh doanh</div>

            <div className={styles.picture}>
              {pictureCertificate.map((picture, idx) => <div key={idx} className={styles.pic}>
                <img alt="" src={picture} />
                <div className={styles.cancel} onClick={() => {
                  setPictureCertificate(pictureCertificate.filter((pic, id) => id !== idx))
                }}>
                  <CloseCircleFilled style={{ color: "#B5B5B5", fontSize: "20px" }} />
                </div>
              </div>)}
              {pictureCertificate.length < 5 && <UploadMultiPicture setPicture={handleAddPictureCertificate} />}
            </div>

            <Row gutter={28}>
              <Col span={24}>
                <Form.Item
                  name="introduction"
                  label="Gi???i thi???u"
                  rules={[
                    {
                      required: true,
                      message: "Tr?????ng gi???i thi???u kh??ng ???????c ????? tr???ng!"
                    },
                    {
                      max: 4000,
                      message: "B???n kh??ng ???????c nh???p qu?? 4000 k?? t???!"
                    }
                  ]}
                >
                  <Input.TextArea autoSize={{ minRows: 4 }}  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={28}>
              <Col span={24}>
                <Form.Item
                  name="introLink"
                  label="Video gi???i thi???u c??ng ty"
                  rules={[
                    {
                      max: 1000,
                      message: "B???n kh??ng ???????c nh???p qu?? 1000 k?? t???!"
                    }
                  ]}
                >
                  <Input placeholder='Nh???p link video c???a youtube'  maxLength={200}  />
                </Form.Item>
              </Col>
              <Col span={24} className='mb-4'>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => <>
                    {
                    (getFieldValue("introLink") && matchYoutubeUrl(getFieldValue("introLink"))) &&
                     <iframe width="100%" height="500"
                     src={getEmbedLinkYoutube(getFieldValue("introLink"))}
                     title="YouTube video player"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen />
                  }
                  </>
                }
              </Form.Item>
              </Col>
            </Row>     

            <div style={{ fontWeight: 500 }}>H??nh ???nh c??ng ty</div>

            <div className={styles.picture}>
              {pictureIntro.map((picture, idx) => <div key={idx} className={styles.pic}>
                <img alt="" src={picture} />
                <div className={styles.cancel} onClick={() => {
                  setPictureIntro(pictureIntro.filter((pic, id) => id !== idx))
                }}>  <CloseCircleFilled style={{ color: "#B5B5B5", fontSize: "20px" }} />
                </div>

              </div>)}
              {pictureIntro.length < 5 && <UploadMultiPicture setPicture={handleAddPictureIntro} />}
            </div>

            <Form.Item className={styles.enterprise_button}>
              <button type='submit'>
                T???o c??ng ty
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <ModalPopup
        visible={isAddAddressModal}
        width={800}
        title="Th??m ?????a ch???"
        isConfirmBtn={false}
        isCancelBtn={false}
        closeBtn
        handleCancelModal={() => setIsAddAddressModal(false)}
      >
        <Map handlePostAddress={handlePostAddress} handleCloseModalMap={() => setIsAddAddressModal(false)} />
      </ModalPopup>
    </div>
  )
}

export default CreateEnterprise