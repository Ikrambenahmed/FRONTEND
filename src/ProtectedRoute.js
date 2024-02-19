import { useNavigate } from "react-router-dom";
import { useSoftUIController, setAuthenticated } from  "context";

const ProtectedRoute = ({ children }) => {
  const [controller] = useSoftUIController();
  const { authenticated } = controller;
  const navigate = useNavigate();

  if (!authenticated) {
    // Redirect to the sign-in page if not authenticated
    navigate("/authentication/sign-in");
    return null;
  }

  return children;
};

export default ProtectedRoute;
