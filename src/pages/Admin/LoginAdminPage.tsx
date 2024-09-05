import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APILogin } from '../../services/service.api';

type FieldType = {
  email: string;
  password: string;
};

const LoginAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    // console.log(values);
    setLoading(true);
    try {
      const res = (await APILogin(values)) as any;
      console.log(res);
      if (res && res?.data?.data !== null) {
        message.success("Đăng Nhập Thành Công!!");
        localStorage.setItem("access_token", res.data.data.token);
        localStorage.setItem("role", res.data.data.role);

        navigate('/admin');
      } else {
        message.error(res?.data.error.errorMessage);
      }
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginAdminPage;
