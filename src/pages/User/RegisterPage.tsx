import { Col, DatePicker, message, Modal, Radio, Row } from "antd";
import type { FormProps, RadioChangeEvent } from "antd";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { APIRegister } from "../../services/service.api";
type PropRegisterPage = {
  isModalRegisterOpen: boolean;
  handleModalRegisterCancel: () => void;
  showModalLogin: () => void;
};
type FieldType = {
  email: string;
  fullname: string;
  gender: number;
  birthday: string;
  phoneNumber: string;
  password: string;
  password2: string;
};
const RegisterPage = ({
  isModalRegisterOpen,
  handleModalRegisterCancel,
  showModalLogin,
}: PropRegisterPage) => {
  const [value, setValue] = useState(1);
  const [form] = Form.useForm();
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const onFinish = async (values: FieldType) => {
    const { birthday, ...restValues } = values;

    const birthdayObj = new Date(birthday);

    const formatToDateString = (dateObj: Date) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const birthdayFormat = formatToDateString(birthdayObj);
    const dataRegister = {
      ...restValues,
      birthday: birthdayFormat,
    };
    console.log("dataRegister", dataRegister);
    // console.log(111);
    const res = await APIRegister(dataRegister);
    console.log(res);
    if (res && res.status === 200 && res.data.error.code === 0) {
      message.success("Đăng Ký thành công !!!");
      handleModalRegisterCancel();
      form.resetFields();
    } else if (res && res.status === 400) {
      console.log(111);
      // Xử lý lỗi ở đây
      // const errorMessage = res.data?.message || "Đăng Ký thất bại !!!";
      // message.error(errorMessage);
    } else if (res === null) {
      message.error("Không thể kết nối với server!!!");
    }
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <Modal
        open={isModalRegisterOpen}
        onCancel={handleModalRegisterCancel}
        footer={<></>}
        style={{ top: 20 }}
      >
        <div className="login-container ">
          <div className="header-form ">
            <div className="logo"></div>
            <div className="title-form text-[50px] font-normal text-center ">
              Đăng Ký
            </div>
            <div className="description-sign-in text-center ">
              Chào mừng trở lại! Vui lòng nhập thông tin để đăng Ký.
            </div>
          </div>
          <div className="form-content ">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label={<div className="font-semibold">Email</div>}
                    name="email"
                    rules={[
                      { required: true, message: "Please input your Email!" },
                      {
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Email...." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label={<div className="font-semibold">Full Name</div>}
                    name="fullname"
                    rules={[
                      { required: true, message: "Please input your Email!" },
                      {
                        pattern: /^[a-zA-Z]+$/,
                        message: "Please enter only letters!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Full Name...." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label={<div className="font-semibold">Phone Number</div>}
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Phone Number!",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Please enter only numbers!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Phone Number...." />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item<FieldType>
                    label={<div className="font-semibold">Birth Day</div>}
                    name="birthday"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Birth Day!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Filled"
                      variant="filled"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label={<div className="font-semibold">Password</div>}
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter Password..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label={
                      <div className="font-semibold">Confirm Password </div>
                    }
                    name="password2"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Confirm Password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter Confirm Password..." />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item<FieldType>
                label={<div className="font-semibold">Gender</div>}
                name="gender"
                rules={[
                  { required: true, message: "Please input your Gender!" },
                ]}
              >
                <Radio.Group onChange={onChange} value={value}>
                  <Radio value={1}>Female</Radio>
                  <Radio value={2}>Male</Radio>
                  <Radio value={3}>Other</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-[450px] bg-[#DA2778] hover:bg-[#DA2778]"
                >
                  Đăng Ký
                </Button>
              </Form.Item>
            </Form>
            <div>
              Bạn có tài khoản?{" "}
              <span
                className="font-bold cursor-pointer"
                onClick={showModalLogin}
              >
                Đăng Nhập.
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterPage;
