import { Modal } from "antd";
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const HomePage = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);

  const showModalLogin = () => {
    setIsModalLoginOpen(true);
  };

  const showModalRegister = () => {
    setIsModalRegisterOpen(true);
  };

  return (
    <div onClick={showModalLogin}>
      HomePage
      {isModalRegisterOpen !== true && (
        <Modal open={isModalLoginOpen} width={500} footer={<></>}>
          <LoginPage showModalRegister={showModalRegister} />
        </Modal>
      )}
      {}
      <RegisterPage isModalRegisterOpen={isModalRegisterOpen} />
    </div>
  );
};

export default HomePage;
