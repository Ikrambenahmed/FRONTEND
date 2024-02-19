import { useState,createContext,useContext } from "react";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { useNavigate } from 'react-router-dom';
import SettingsModal from "./SettingsModal";
import image from "assets/images/curved-images/image.jpeg";
import { useSoftUIController, setAuthenticated } from  "context";
import { useToken } from "TokenProvider";


function SignIn() {

  const { token, setToken, clearToken,setUserId } = useToken();
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [pswrd, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const [databaseSettings, setDatabaseSettings] = useState(null);
  const AuthContext = createContext();

  const saveDatabaseSettings = async () => {
    try {
      const databaseData = {
        USER_ID: email,
        pswrd,
        username: databaseSettings.username,
        password: databaseSettings.password,
        port: databaseSettings.port,
        host: databaseSettings.host,
        service_name: databaseSettings.service_name,
      };
  
      const response = await fetch("http://127.0.0.1:5000/set_database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(databaseData),
      });
  
      const data = await response.json();
  
      if (data.login_response.login) {
        // Successful login logic (e.g., redirect to dashboard)
        localStorage.setItem('access_token', data.access_token);
        setToken(data.access_token);
        // Successful login logic (e.g., redirect to dashboard)
        console.log("Login successful! token : ",data.access_token);
        setAuthenticated(dispatch, true);
        navigate('/dashboard'); // Change '/dashboard' to the desired route
      } else {
        // Failed login logic
        console.log("Login failed:", data.login_response.message);
        setErrorMessage(data.login_response.message); // Update error message state
      }
    } catch (error) {
      console.error("Error during database connection:", error);
  
      if (error.response) {
        // The request was made and the server responded with a non-2xx status code
        const status = error.response.status;
  
        switch (status) {
          case 404:
            setErrorMessage("Not Found: The requested resource was not found.");
            break;
          case 500:
            setErrorMessage("Internal Server Error: Something went wrong on the server.");
            break;
          // Add more cases for other HTTP status codes as needed
          default:
            setErrorMessage(`Error ${status}: An unexpected error occurred.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("No Response: The server did not respond to the request.");
      } else {
        // Something happened in setting up the request that triggered an error
        setErrorMessage("Request Error: Unable to send the request.");
      }
    }
  };
  const [, dispatch] = useSoftUIController();

  const login = async () => {
    try {

      const loginData = {
        USER_ID: email,
        pswrd
      };
  
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ USER_ID: email, pswrd }),
      });

      const data = await response.json();
  
      if (data.login_response.login) {
        // Successful login logic (e.g., redirect to dashboard)
        console.log("Login successful! token : ",data.access_token);
        localStorage.setItem('access_token', data.access_token);
        setAuthenticated(dispatch, true);
        console.log('setAuthenticated',setAuthenticated)
        setToken(data.access_token);
        setUserId(loginData['USER_ID']);
        
        console.log('UserId IN LOGIN : ',loginData['USER_ID'])
        navigate('/dashboard'); // Change '/dashboard' to the desired route
      } else {
        // Failed login logic
        console.log("Login failed:", data.login_response.message);
        setErrorMessage(data.login_response.message); // Update error message state
      }
    } catch (error) {
      console.error("Error during database connection:", error);
  
      if (error.response) {
        // The request was made and the server responded with a non-2xx status code
        const status = error.response.status;
  
        switch (status) {
          case 404:
            setErrorMessage("Not Found: The requested resource was not found.");
            break;
          case 500:
            setErrorMessage("Internal Server Error: Something went wrong on the server.");
            break;
          // Add more cases for other HTTP status codes as needed
          default:
            setErrorMessage(`Error ${status}: An unexpected error occurred.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("No Response: The server did not respond to the request.");
      } else {
        // Something happened in setting up the request that triggered an error
        setErrorMessage("Request Error: Unable to send the request.");
      }
    }
  };

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
  };


 const handleSettingsSave = (settings) => {
  // Handle saving settings (you can send them to the server or store in localStorage)
  console.log("Settings saved:", settings);
  setDatabaseSettings(settings);
};

 return (
  <>
    <CoverLayout title="Welcome" description="Enter your username and password to sign in" image={image}>
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Username
            </SoftTypography>
          </SoftBox>
          <SoftInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput type="password" placeholder="Password" value={pswrd} onChange={(e) => setPassword(e.target.value)} />
        </SoftBox>
        {/* Removed Remember me Switch */}
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" fullWidth onClick={login}>
            sign in
          </SoftButton>
          {errorMessage && (
            <SoftBox mt={2} textAlign="center">
              <SoftTypography variant="caption" color="error" fontWeight="medium">
                {errorMessage}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Didn&apos;t set your database yet ?{" "}
            <SoftTypography
              component="button"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
              onClick={handleSettingsClick} // Open the modal on click
            >
              Go to Settings
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
    <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSettingsSave}
      />
  </>
);
}

export default SignIn;
