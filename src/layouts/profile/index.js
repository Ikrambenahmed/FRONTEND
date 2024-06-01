/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useState, useEffect } from 'react';

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useNavigate } from "react-router-dom";
import { useToken } from "TokenProvider";

function Overview() {
  const { tokenData } = useToken();
  const { token, setToken, clearToken } = useToken();

  const userId = token?.userId;
  console.log('userId',userId) ; 
  console.log('token',token) ; 
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/getProfile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data.user);
        } else {
          console.error('Error fetching user profile:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  return (
    <DashboardLayout>
      <Header />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            {profileData && (
              <ProfileInfoCard
                info={{
                  User:profileData.USER_ID,
                  fullName: profileData.NAME,
                  email: profileData.EMAIL || 'No email provided',
                  // Add more fields as needed
                }} 
                action={{ route: '', tooltip: 'Edit Profile' }}
              />
            )}
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox mb={3}></SoftBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Overview;
