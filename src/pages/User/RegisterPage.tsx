import { Modal } from "antd";
import React from "react";

type PropRegisterPage = {
  isModalRegisterOpen: boolean;
};

const RegisterPage = ({ isModalRegisterOpen }: PropRegisterPage) => {
  return (
    <div>
      <Modal title="Basic Modal" open={isModalRegisterOpen}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default RegisterPage;
