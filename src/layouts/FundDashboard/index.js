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
import PropTypes from "prop-types"; // Import PropTypes
import { Chrono } from "react-chrono";

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

import SoftButton from "components/SoftButton";


// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
// Soft UI Dashboard React base styles
import borders from "assets/theme/base/borders";
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";

import Card from "@mui/material/Card";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";
import Table from "examples/Tables/Table";
import SoftProgress from "components/SoftProgress";

import { useEffect } from "react";
import { useState } from "react";


function Completion({ value, color }) {
  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography variant="caption" color="text" fontWeight="medium">
        {value}%&nbsp;
      </SoftTypography>
      <SoftBox width="8rem">
        <SoftProgress value={value} color={color} variant="gradient" label={false} />
      </SoftBox>
    </SoftBox>
  );
}

function FundDashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const { borderWidth, borderColor } = borders;
  const [fundName, setFundName] = useState('');
  const [records, setRecords] = useState([]);
  const action = (
    <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
      more_vert
    </Icon>
  );

  useEffect(() => {
    if (fundName.trim() !== '') {
      fetch(`http://127.0.0.1:5000/api/getFndmas/${fundName}`)
        .then(response => response.json())
        .then(data => {
          setRecords(data.data)
          console.log('getFndmas data', data)
        })
        .catch(err => console.log(err));
    }
  }, [fundName]);


  useEffect(() => {
    // Fetch all funds and populate the dropdown
    fetch('http://127.0.0.1:5000/api/getAllFunds')
      .then(response => response.json())
      .then(data => {
        const dropdown = document.getElementById('fundDropdown');
        // Clear previous options
        dropdown.innerHTML = '';
        // Add an empty default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '';
        dropdown.add(defaultOption);
        // Add each fund as an option in the dropdown
        data.data.forEach(fund => {
          const option = document.createElement('option');
          option.value = fund.FUND;  // Assuming FUND is the unique identifier
          option.text = fund.FUND;  // Displaying the fund name
          dropdown.add(option);
        });
      })
      .catch(error => console.error('Error fetching funds:', error));
  }, []);
  
  const getCurrentDate = () => {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const [workflowData, setWorkflowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (fundName.trim() !== '') {
      fetch(`http://127.0.0.1:5000/api/workflow/${fundName}`)
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data);
          setWorkflowData(data.fund_data);
          filterDataByWeekday(data.fund_data);
          console.log('filtered inside workflow', filteredData);
        })
        .catch(err => console.log(err));
    }
  }, [fundName]);
  
  const filterDataByWeekday = (data) => {
    const currentDate = new Date();
    // Get the current weekday (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const currentWeekday = currentDate.getDay();

    console.log('currentWeekday now', currentWeekday);

    // const backendDayOfWeek = currentWeekday === 0 ? 7 : currentWeekday + 1; // Adjust Sunday to 7
    const backendDayOfWeek = currentWeekday === 0 ? 7 : currentWeekday;

    console.log('backendDayOfWeek', backendDayOfWeek)
    const filtered = data.filter(item => (
      parseFloat(item.probability) !== 0 && parseInt(item.day_of_week, 10) === backendDayOfWeek
      // item.day_of_week === currentWeekday
    ));

    setFilteredData(filtered);

  };

  const getColorBasedOnCondition = (item) => {
    // Your logic to determine color based on item properties
    // Example: Return 'success' if probability is greater than 50%, otherwise return 'dark'
    return item.probability > 50 ? 'success' : 'dark';
  };

  const getIconBasedOnCondition = (item) => {
    // Your logic to determine icon based on item properties
    // Example: Return 'arrow_upward' if process is successful, otherwise return 'priority_high'
    return item.process_name === 'Successful Process' ? 'arrow_upward' : 'priority_high';
  };

  // ...
  const workflowTableData = {
    columns: [
      { name: "processName", align: "left", label: "Process Name" },
      { name: "startTime", align: "left", label: "Start Time" },
      { name: "endTime", align: "left", label: "End Time" },
      { name: "action", align: "center", label: "Action" },
      { name: "probability", align: "center", label: "Probability" },
    ],

    rows: filteredData
      .sort((a, b) => a.avg_start_time - b.avg_start_time) // Sort by avg_start_time
      .map((item) => ({
        processName: item.process_name,
        startTime: `${item.avg_start_time}`,
        endTime: ` ${item.avg_end_time}`,
        action: (
          <Icon color="inherit" fontSize="small">
            {getIconBasedOnCondition(item)} {/* Use getIconBasedOnCondition dynamically */}
          </Icon>
        ),
        probability: (
          <Completion
            value={item.probability}
            color={getColorBasedOnCondition(item)} // Use getColorBasedOnCondition dynamically
          />
        ),
      })),
  };
  // ...
  const mappedEvents = [
    {
      title: "Event 1",
      cardTitle: "Card Title 1",
      cardSubtitle: "Card Subtitle 1",
      cardDetailedText: "Detailed Text 1",
      media: {
        type: "IMAGE",
        source: {
          url: "https://example.com/image1.jpg",
        },
      },
    },
    {
      title: "Event 2",
      cardTitle: "Card Title 2",
      cardSubtitle: "Card Subtitle 2",
      cardDetailedText: "Detailed Text 2",
      media: {
        type: "IMAGE",
        source: {
          url: "https://example.com/image2.jpg",
        },
      },
    },
    // Add more events as needed
  ];
  // Define a function to format workflow data for Chrono
  console.log('Formatted Workflow Data:', formatWorkflowDataForChrono(filteredData));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <SoftBox
              border={`${borderWidth[1]} solid ${borderColor}`}
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
            >
              {/* Dropdown for funds */}
              <label htmlFor="fundDropdown" style={{ marginRight: '10px' }}>Select a Fund:</label>
              <select
                id="fundDropdown"
                onChange={(e) => setFundName(e.target.value)}
                value={fundName}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: `1px solid ${borderColor}`,
                  width: '200px', // Adjust the width as needed
                }}
              >
                {/* Options will be dynamically added using JavaScript */}
              </select>

              {/* SoftInput for fund ID search */}
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox py={3}>

        <SoftBox mb={3}>
          <Grid container spacing={3}>

            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Accountant" }}
                count={records.FNDMAS ? records.FNDMAS.ACCOUNTANT : ""}
                icon={{ color: "info", component: "public" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Latest Nav" }}
                count={records.FNDMAS ? records.LatestNAVHST.NET_VALUE : ""}
                percentage={{
                  color: records.percentage_change < 0 ? "danger" : "success",
                  text: records.FNDMAS ? `${records.percentage_change}%` : "",
                }}
                icon={{ color: "info", component: "paid" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Assets" }}
                count={records.FNDMAS ? records.LatestNAVHST.ASSETS : ""}
                percentage={{
                  color: records.assets_percentage_change < 0 ? "danger" : "success",
                  text: records.FNDMAS ? `${records.assets_percentage_change}%` : "",
                }}
                icon={{ color: "info", component: "emoji_events" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Liabilities" }}
                count={records.FNDMAS ? records.LatestNAVHST.LIABILITY : ""}
                percentage={{
                  color: records.liabilities_percentage_change < 0 ? "danger" : "success",
                  text: records.FNDMAS ? `${records.liabilities_percentage_change}%` : "",
                }}
                icon={{
                  color: "info",
                  component: "shopping_cart",
                }}
              />
            </Grid>
          </Grid>

        </SoftBox>
      </SoftBox>

      <SoftBox>




        <Card sx={{ height: "100%" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
            <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              Your Workflow
            </SoftTypography>
            <SoftBox display="flex" alignItems="flex-start">
              <SoftBox color="text" mr={0.5} lineHeight={0}>
                <Icon color="inherit" fontSize="small">
                  date_range
                </Icon>
              </SoftBox>
              <SoftTypography variant="button" color="text" fontWeight="regular">
                {getCurrentDate()}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox pt={3} pb={2} px={2}>
            <SoftBox mb={2}>
              <SoftTypography
                variant="caption"
                color="text"
                fontWeight="bold"
                textTransform="uppercase">
                Ordered by Start Time
              </SoftTypography>
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              {/* Add Chrono component here */}
              {filteredData && filteredData.length > 0 ? (
                <Chrono items={formatWorkflowDataForChrono(filteredData)} mode="VERTICAL" />
              ) : (
                <SoftTypography variant="body2" color="textSecondary">
                  No workflow data available.
                </SoftTypography>
              )}
              {/* Replace the following line with the commented version */}
              {/* <Table columns={workflowTableData.columns} rows={workflowTableData.rows} /> */}
            </SoftBox>


          </SoftBox>
        </Card>

      </SoftBox>




      <Footer />
    </DashboardLayout>


  );
}
const formatWorkflowDataForChrono = (filteredData) => {
  return filteredData.map((item) => {
    return {
      title: item.process_name,
      cardTitle: item.process_name,
      cardSubtitle: `Probability: ${item.probability}%`,
      cardDetailedText: `Start Time: ${item.avg_start_time}, End Time: ${item.avg_end_time}`,
    };
  });
};

Completion.propTypes = {
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default FundDashboard;

