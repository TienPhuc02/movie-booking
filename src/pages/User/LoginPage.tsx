import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import "../../css/Button.css";
import "../../css/Input.css";
type FieldType = {
  email?: string;
  password?: string;
};
type PropLoginPage = {
  showModalRegister: () => void;
};
const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoginPage = ({ showModalRegister }: PropLoginPage) => {
  return (
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
          // className="max-w-[1000px] mx-auto"
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
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Email Password..." />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="w-[450px] bg-[#DA2778] hover:bg-[#DA2778]"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
        <div>
          Bạn chưa có tài khoản?{" "}
          <span className="font-bold" onClick={showModalRegister}>
            Đăng ký.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
