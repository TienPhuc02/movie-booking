import NotPermission from '../pages/NotFound/NotPermission';

const ProtectRoute = ({ children }) => {
  const role = localStorage.getItem('role');
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
