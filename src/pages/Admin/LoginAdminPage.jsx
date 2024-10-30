import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APILogin } from '../../services/service.api';



const LoginAdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    // console.log(values);
    setLoading(true);
    try {
      const res = (await APILogin(values)) ;
      console.log(res);
      if (res && res?.data?.data !== null) {
        message.success("Đăng Nhập Thành Công!!");
        localStorage.setItem("access_token", res.data.data.token);
        localStorage.setItem("role", res.data.data.role);

        navigate('/admin/user');
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-2xl p-16 bg-white rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-600">ĐĂNG NHẬP ADMIN</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<div className="font-semibold text-xl">Email</div>}
            name="email"
            rules={[
              { required: true, message: "Xin hãy nhập Email của bạn!" },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Vui lòng nhập địa chỉ Email hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập Email..." className="rounded-lg h-14 text-lg" />
          </Form.Item>

          <Form.Item
            label={<div className="font-semibold text-xl">Mật khẩu</div>}
            name="password"
            rules={[{ required: true, message: "Xin hãy nhập mật khẩu của bạn!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu..." className="rounded-lg h-14 text-lg" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-3xl"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginAdminPage;
