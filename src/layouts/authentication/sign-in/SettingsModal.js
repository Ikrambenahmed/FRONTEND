import React, { useState } from "react";
import Modal from "components/Modal";
import SoftBox from "components/SoftBox";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";

function SettingsModal({ isOpen, onClose, onSave }) {
  const [databaseName, setDatabaseName] = useState("");
  const [databasePassword, setDatabasePassword] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [host, setHost] = useState("");
  const [databasePort, setDatabasePort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [connectionResult, setConnectionResult] = useState(null);

  const testConnectionAPI = async (databaseInfoJSON) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/test_connection", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databaseInfoJSON),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // If the response status is not okay, throw an error with the message from the server
        throw new Error(result.message);
      }
  
      return result;
    } catch (error) {
      console.error('Error in testConnectionAPI:', error);
  
      // If there's an error, return a result with success set to false and the error message
      return { success: false, message: `Error: ${error.message}` };
    }
  };
    const handleSave = () => {
    // Package the database settings into an object
    const databaseSettings = {
      username: databaseName,
      password: databasePassword,
      port:databasePort,
      host,
      service_name: serviceName,
    };
      // Call the onSave callback with the database settings
      onSave(databaseSettings);

      // Close the modal after saving
      onClose();
    };
      

  const handleTestConnection = async () => {
    // Package the database settings into an object
    const databaseInfoJSON = {
      username:databaseName,
      password:databasePassword,
      host,
      port: databasePort,
      service_name: serviceName,
    };
  
    // Log the JSON object
    console.log("Database Information JSON:", databaseInfoJSON);
  
    try {
      // Call the testConnectionAPI function
      const result = await testConnectionAPI(databaseInfoJSON);
  
      // Set the connection result for displaying the message
      setConnectionResult(result);
  
      // Handle the result (success or failure)
      if (result.success) {
        console.log('Database connection successful:', result.message);
      } else {
        console.error('Database connection failed:', result.message);
      }
    } catch (error) {
      console.error('Error in handleTestConnection:', error);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={{ zIndex: 1000 /* Set a higher zIndex value */ }}>
      <SoftBox p={4}>
        <SoftTypography variant="h5" fontWeight="bold" mb={3}>
          Database Settings
        </SoftTypography>
        <SoftBox mb={2}>
          <SoftTypography variant="body2" mb={1}>
            Database Name:
          </SoftTypography>
          <SoftInput
            type="text"
            placeholder="Enter database name"
            value={databaseName}
            onChange={(e) => setDatabaseName(e.target.value)}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftTypography variant="body2" mb={1}>
            Database password:
          </SoftTypography>
          <SoftInput
            type="text"
            placeholder="Enter database password"
            value={databasePassword}
            onChange={(e) => setDatabasePassword(e.target.value)}
          />
        </SoftBox>

        <SoftBox mb={2}>
          <SoftTypography variant="body2" mb={1}>
            Database Port:
          </SoftTypography>
          <SoftInput
            type="number"
            placeholder="Enter database port"
            value={databasePort}
            onChange={(e) => setDatabasePort(e.target.value)}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftTypography variant="body2" mb={1}>
            Host:
          </SoftTypography>
          <SoftInput
            type="text"
            placeholder="Enter Host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftTypography variant="body2" mb={1}>
            Service Name:
          </SoftTypography>
          <SoftInput
            type="ServiceName"
            placeholder="Enter Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </SoftBox>
               {/* Display connection result message */}
               {connectionResult && (
                <SoftTypography
  variant="body2"
  mb={1}
  color={connectionResult.success ? "success" : "error"}
>
  {connectionResult.success
    ? "Database connection successful"
    : "Database connection failed"}
</SoftTypography>
        )}

        <SoftButton variant="gradient" color="info" onClick={handleSave}>
          Save
        </SoftButton>
        <SoftButton variant="gradient" color="success" onClick={handleTestConnection}>
          Test Connection
        </SoftButton>
      </SoftBox>
    </Modal>
  );
}

export default SettingsModal;
