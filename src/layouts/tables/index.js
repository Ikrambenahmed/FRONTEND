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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useEffect } from "react";
import { useState } from "react";
import borders from "assets/theme/base/borders";
import OpnposTable from "layouts/tables/data/OpnposTable" ; 

function Tables() {
  const { columns, rows } = authorsTableData;
  const { columns: prCols, rows: prRows } = projectsTableData;
  const { borderWidth, borderColor } = borders;
  const [fundName, setFundName] = useState('');

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

      <OpnposTable selectedFund={fundName} />

      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">table Positions</SoftTypography>
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
              <Table columns={columns} rows={rows} />
            </SoftBox>
          </Card>
        </SoftBox>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SoftTypography variant="h6">Projects table</SoftTypography>
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
            <Table columns={prCols} rows={prRows} />
          </SoftBox>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
