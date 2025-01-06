import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/login/login";
// import Dev from "../pages/dev";
import ChatApp from "../pages/main/main";
import AuthCheck from "./authCheck";
// const Register = React.lazy(() => import("../pages/register/register"));
// const Dev = React.lazy(() => import("../pages/dev"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login></Login>} />
        {/* <Route
          path="/dev"
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <Dev></Dev>
            </React.Suspense>
          }
        /> */}
        {/* <Route
          path="register"
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <Register></Register>
            </React.Suspense>
          }
        ></Route> */}
        <Route
          path="/main"
          element={
            <AuthCheck>
              <ChatApp></ChatApp>
            </AuthCheck>
          }
        />
        <Route path="*" element={<div>Lost！</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
