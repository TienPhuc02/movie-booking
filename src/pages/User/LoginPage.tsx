import type { FormProps } from "antd";
import { Button, Form, Input, message, Modal } from "antd";
import "../../css/Button.css";
import "../../css/Input.css";
import { APILogin } from "../../services/service.api";

type FieldType = {
  email: string;
  password: string;
};

type PropLoginPage = {
  showModalRegister: () => void;
  handleModalLoginCancel: () => void;
  isModalLoginOpen: boolean;
};

const LoginPage = ({
  showModalRegister,
  handleModalLoginCancel,
  isModalLoginOpen,
}: PropLoginPage) => {
  const [form] = Form.useForm();
  const onFinish = async (values: FieldType) => {
    console.log(values);
    try {
      const res = (await APILogin(values)) as any;
      console.log(res.data.data.role);
      if (res && res?.data?.data !== null) {
        message.success("Đăng Nhập Thành Công!!");
        handleModalLoginCancel();
        form.resetFields();
        localStorage.setItem("access_token", res.data.data.token);
        localStorage.setItem("role", res.data.data.role);
      } else {
        message.error(res?.data.error.errorMessage);
      }
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      open={isModalLoginOpen}
      width={500}
      onCancel={() => {
        form.resetFields();
        handleModalLoginCancel();
      }}
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
            form={form}
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
                { required: true, message: "Xin hãy nhập Email của bạn!" },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Vui lòng nhập địa chỉ Email hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Enter Email...." />
            </Form.Item>

            <Form.Item<FieldType>
              label={<div className="font-semibold">Mật khẩu</div>}
              name="password"
              rules={[
                { required: true, message: "Xin hãy nhập password của bạn!" },
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
