import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const HomePage = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const showModalLogin = () => {
    setIsModalLoginOpen(true);
    setIsModalRegisterOpen(false);
  };
  const handleModalLoginCancel = () => {
    setIsModalLoginOpen(false);
  };
  const handleModalRegisterCancel = () => {
    setIsModalRegisterOpen(false);
    setIsModalLoginOpen(false);
  };

  const showModalRegister = () => {
    setIsModalRegisterOpen(true);
  };
  console.log(isModalLoginOpen);
  return (
    <div>
      <span onClick={showModalLogin}>HomePage</span>
      {isModalRegisterOpen !== true && (
        <LoginPage
          isModalLoginOpen={isModalLoginOpen}
          handleModalLoginCancel={handleModalLoginCancel}
          showModalRegister={showModalRegister}
        />
      )}
      <RegisterPage
        isModalRegisterOpen={isModalRegisterOpen}
        showModalLogin={showModalLogin}
        handleModalRegisterCancel={handleModalRegisterCancel}
      />
    </div>
  );
};

export default HomePage;
