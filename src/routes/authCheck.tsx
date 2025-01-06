import { useNavigate } from "react-router-dom";
import { useEffect, useState, ReactElement } from "react";

function AuthCheck({ children }: { children: ReactElement<any, any> }) {
  let navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Check if the user has logged in
    const checkAuthentication = () => {
      const isAuthenticated: boolean = !!sessionStorage.getItem("webImAuth");
      setIsAuthenticated(isAuthenticated);
      if (!isAuthenticated) {
        navigate("/login"); // Jump to the login page
      }
    };

    checkAuthentication();
  }, []);

  return isAuthenticated ? children : <></>;
}

export default AuthCheck;
