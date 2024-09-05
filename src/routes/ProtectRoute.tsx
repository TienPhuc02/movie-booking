import NotPermission from "../pages/NotFound/NotPermission";

type Props = {};

const ProtectRoute = ({ children }: any) => {
  const role = localStorage.getItem("role");
  console.log(role);
  return (
    <>
      {role && (role === undefined || +role !== 0) ? (
        <>
          <NotPermission />
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ProtectRoute;