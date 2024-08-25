import React from "react";
import axios from "axios"; // Import Axios
import type { FormProps } from "antd";
import { Button, Form, Input, message, Modal } from "antd";
import "../../css/Button.css";
import "../../css/Input.css";

type FieldType = {
  email?: string;
  password?: string;
  code:  number;
  message: string;
};

type PropLoginPage = {
  showModalRegister: () => void;
  handleModalLoginCancel: () => void;
  isModalLoginOpen: boolean;
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  try {
    const response = await axios.post('https://localhost:7196/api/v1/Auth/login', {
      email: values.email,
      password: values.password,
    });

    const data= response.data;
    if(response.status === 200) {
      if(data.error.code === 0) {
        alert(data.error.message);
      }else{
        alert(data.error.message);
      }
        // Xử lý khi đăng nhập thành công
    }else{
      console.error("Unexpected status code:", response.status);
      alert("Something went wrong. Please try again.");
    }
    // Xử lý khi đăng nhập thành công, ví dụ: lưu token, chuyển hướng
  } catch (error) {
    console.error("Failed:", error);
    // Xử lý khi đăng nhập thất bại, ví dụ: hiển thị thông báo lỗi
  }
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoginPage = ({
  showModalRegister,
  handleModalLoginCancel,
  isModalLoginOpen,
}: PropLoginPage) => {
  return (
    <Modal
      open={isModalLoginOpen}
      width={500}
      onCancel={handleModalLoginCancel}
      footer={<></>}
    >
      <div className="login-container ">
        <div className="header-form ">
          <div className="logo"></div>
          <div className="title-form text-[50px] font-normal text-center ">
            Đăng Nhập
          </div>
          <div className="description-sign-in text-center ">
            Chào mừng trở lại! Vui lòng nhập thông tin để đăng nhập.
          </div>
        </div>
        <div className="form-content ">
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
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

            <Form.Item<FieldType>
              label={<div className="font-semibold">Password</div>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter Password..." />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="w-[450px] bg-[#DA2778] hover:bg-[#DA2778] cursor-pointer"
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
          <div>
            Bạn chưa có tài khoản?{" "}
            <span
              className="font-bold cursor-pointer"
              onClick={showModalRegister}
            >
              Đăng ký.
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginPage;
