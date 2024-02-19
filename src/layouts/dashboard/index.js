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
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom'; // Import the chartjs-plugin-zoom

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

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
import { useToken } from "TokenProvider";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import ProtectedRoute from "ProtectedRoute"; // Adjust the path if needed
import { useEffect } from "react";
import { useState } from "react";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const { token, setToken, clearToken } = useToken();
  const [error, setError] = useState(null);
  const [total_assets, setTotalAssets] = useState('');
  const [total_liabilities, setTotalLiabilities] = useState('');
  const [total_nav, setTotalNav] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [lineChartData, setLineChartData] = useState({});
  const [chartData, setChartData] = useState({});
  const [ChartDataPrices, setChartDataPrices] = useState({});
  
  const [PriceChange, setPriceChange] = useState({});

  const [itemsData, setItemsData] = useState([]);


  const fetchData = async () => {
    try {
      const apiUrl = `http://127.0.0.1:5000/api/calculate_totals`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTotalAssets(data.total_assets);
      setTotalLiabilities(data.total_liabilities);
      setTotalNav(data.total_nav);

    } catch (error) {
      setFetchError(error.message);
    }
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {

    const fetchLineChartData = async () => {
      try {
        const apiUrl = 'http://127.0.0.1:5000/api/AssetAllocation';
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data alloc', data);

        const labels = data.most_traded_ticker_types.map(entry => entry.label);
        const opnposCounts = data.most_traded_ticker_types.map(entry => entry.opnpos_count);

        console.log('opnposCounts', opnposCounts)
        setLineChartData({
          labels: labels,
          datasets: [
            {
              label: 'Asset Allocation',
              data: opnposCounts,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.4)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching line chart data:', error.message);
      }
    };

    fetchLineChartData();
  }, []);


  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const apiUrl = 'http://127.0.0.1:5000/api/AssetAllocation';
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data from API', data);

        const chartLabels = data.most_traded_ticker_types.map(entry => entry.label);
        console.log('chartLabels', chartLabels)
        const chartDataValues = data.most_traded_ticker_types.map(entry => entry.opnpos_count);
        console.log('chartDataValues', chartDataValues)

        const chart = {
          labels: chartLabels,
          datasets:
            { label: "Sales", data: [chartDataValues[0], chartDataValues[1], chartDataValues[2], chartDataValues[3]] },
        };

        const items = data.most_traded_ticker_types.map(entry => ({
          icon: { color: "primary", component: "library_books" },
          label: entry.label,
          progress: { content: entry.opnpos_count, percentage: entry.progressPercentage },
        }));

        setChartData(chart);
        setItemsData(items);
      } catch (error) {
        console.error('Error fetching data from API:', error.message);
      }
    };

    fetchDataFromAPI();
  }, []);


  useEffect(() => {
    const fetchDataFromAPIPrices = async () => {
      try {
        const apiUrl = 'http://127.0.0.1:5000/api/highestPriceChange';
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data from API', data);

        const chartLabels = data.prihstdata_list.map(entry => entry.prcdate);
        console.log('chartLabels', chartLabels);
        
        const chartDataValues = data.prihstdata_list.slice(0, 9).map(entry => entry.price);
        console.log('chartDataValues', chartDataValues);
        const priceChange =data.highest_change
        const chart = {
          labels: chartLabels,
          datasets: [
            {
              label: data.highest_change_ticker,
              data: chartDataValues,
              color:"info"
              // Other properties if needed
            }
          ],
        };
        console.log('chart', chart);
        setPriceChange(priceChange) ; 
        setChartDataPrices(chart);

        


      } catch (error) {
        console.error('Error fetching data from API:', error.message);
      }
    };

    fetchDataFromAPIPrices();
  }, []);





  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} xl={4}>
                <MiniStatisticsCard
                  title={{ text: "Total NAV" }}
                  count={total_nav !== '' ? total_nav : 'Loading...'}
                  percentage={{ color: "success", text: "" }}
                  icon={{ color: "info", component: "public" }}
                  className={total_assets !== '' && parseFloat(total_assets) < 0 ? "text-error" : "text-success"}

                />
              </Grid>
              <Grid item xs={12} sm={6} xl={4}>
                <MiniStatisticsCard
                  title={{ text: "Total Assets" }}
                  count={total_assets !== '' ? total_assets : 'Loading...'}
                  percentage={{ color: "error", text: "" }}
                  icon={{ color: "info", component: "emoji_events" }}
                  className={total_assets !== '' && parseFloat(total_assets) < 0 ? "text-error" : "text-success"}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={4}>
                <MiniStatisticsCard
                  title={{ text: "Total Liabilities" }}
                  count={total_liabilities !== '' ? total_liabilities : 'Loading...'}
                  percentage={{ color: "success", text: "" }}
                  icon={{
                    color: "info",
                    component: "shopping_cart",
                  }}
                  className={total_assets !== '' && parseFloat(total_assets) < 0 ? "text-error" : "text-success"}
                />
              </Grid>
            </Grid>
          </SoftBox>

          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={5}>
               
                <ReportsBarChart title="Most traded ticker types" description={
                  <>
                    <strong>Count of open positions for each ticker type</strong>
                  </>
                } chart={chartData} items={itemsData} />

              </Grid>


              <Grid item xs={12} lg={7}>

              <GradientLineChart
                title="Prices Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon className="font-bold">arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                   more{" "}
                      <SoftTypography variant="button" color="text" fontWeight="regular">
                        in 2024
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={ChartDataPrices} 
              />

              </Grid>


            </Grid>
          </SoftBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
            </Grid>
          </Grid>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    </ProtectedRoute>

  );
}

export default Dashboard;
