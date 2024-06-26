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
import LineChart from "./LineChart";

import Button from "@mui/material/Button";

// @mui material components
import Grid from "@mui/material/Grid";
import 'chartjs-adapter-date-fns'; // Import the date adapter
import SPLoader from "components/Spinner/Spinner"; // Adjust the path if needed

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton  from "components/SoftButton";

// Soft UI Dashboard React components
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import PropTypes from "prop-types"; // Import PropTypes

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import borders from "assets/theme/base/borders";
import ProtectedRoute from "ProtectedRoute"; // Adjust the path if needed
import { useToken } from "TokenProvider";
import Spinner from "components/Spinner/Spinner";

import { useEffect } from "react";
import { useState } from "react";
import StocksGraph from "./StocksGraph";
export const chartJsConfig = {
  scales: {
    x: {
      type: 'time', // Assuming time-based data for X-axis
      time: {
        unit: 'day', // Adjust according to your data
      },
    },
    y: {
      type: 'linear', // Assuming linear scale for Y-axis
      // Add any additional configurations for the Y-axis
    },
  },
  // Other chart configurations...
};


export const UserData = [
  {
    id: 1,
    year: 2016,
    userGain: 80000,
    userLost: 823,
  },
  {
    id: 2,
    year: 2017,
    userGain: 45677,
    userLost: 345,
  },
  {
    id: 3,
    year: 2018,
    userGain: 78888,
    userLost: 555,
  },
  {
    id: 4,
    year: 2019,
    userGain: 90000,
    userLost: 4555,
  },
  {
    id: 5,
    year: 2020,
    userGain: 4300,
    userLost: 234,
  },
];

function BillingPrices() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);

  const [prices, setPrices] = useState([]);
  const { borderWidth, borderColor } = borders;
  const [fundName, setFundName] = useState('');
  const [tickername, setTickerName] = useState('');
  const [tickersFetched, setTickersFetched] = useState(false);
  const { token, setToken, clearToken } = useToken();

  const userId = token?.userId;

  //const token = localStorage.getItem('access_token');

  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  const handleCreateModel = () => {
    // Check if prices are available
    if (prices.length === 0) {
      console.error('No prices available to create the model.');
      return;
    }
    console.log(prices)  ; 

    console.error('tickername',tickername);

    const requestData = {
      data: prices,
    };

 
    setIsPredicting(true);


    

    fetch(`http://127.0.0.1:5000/api/CreateUse/${tickername}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`

      },
      body: JSON.stringify(prices), // Directly send the prices array
    })
      .then(response => response.json())
      .then(predictedData => {
        console.log('API response:', predictedData);
              // Get the last date from the existing prices
      const lastDateStr = prices[prices.length - 1].prcdate;
      if (!lastDateStr) {
        console.error('Last date is undefined');
        return;
      }
      
      const lastDate = new Date(lastDateStr);
      if (isNaN(lastDate.getTime())) {
        console.error('Invalid date format in existing prices:', lastDateStr);
        return;
      }

      console.log('Last valid date:', lastDate.toISOString());

        const datedPredictedPrices = predictedData.map((predictedPrice, index) => {
          const newDate = new Date(lastDate);
          newDate.setDate(newDate.getDate() + index + 1);
          return {
            fund: 'ABFORT', // Assuming this is constant for all predicted prices
            prcdate: newDate.toUTCString(), // Format date as "Day, DD Mon YYYY HH:MM:SS GMT"
            price: predictedPrice[0], // Assuming the price is always at index 0
            source: '26', // Assuming this is constant for all predicted prices
            tkr: 'AAPL' // Assuming this is constant for all predicted prices
          };
        });
        

        console.log('Dated predicted prices:', datedPredictedPrices);

        const combinedPrices = [...prices, ...datedPredictedPrices];
        console.log('prices',prices)
        console.log('datedPredictedPrices',datedPredictedPrices)
        console.log('combinedPrices',combinedPrices)
        setPrices(combinedPrices);
      })
      .catch(error => {
        console.error('Error calling API:', error);
      })
      .finally(() => {
        setIsPredicting(false);
      });
    };
  


  useEffect(() => {
    
   setIsLoading(true);

   fetch('http://127.0.0.1:5000/api/getUsrFnd', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.token}`,

      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ USER_ID: userId }),
  })

      .then(response => response.json())
      .then(data => {
        setIsLoading(false);

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

  useEffect(() => {
    if (fundName.trim() !== '') {
      // Fetch tickers based on the selected fund
      fetch(`http://127.0.0.1:5000/api/getOpnpos/${fundName}`, {
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json()
        )
        .then(data => {
          console.log('tickers selected test', data.fund_data)
          const dropdown = document.getElementById('tickerDropdown');
          dropdown.innerHTML = '';
  
          // Add an empty default option
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.text = '';
          dropdown.add(defaultOption);
  
          // Add each ticker as an option in the dropdown
          data.fund_data.forEach(ticker => {
            if (ticker.tkr_type === '1') {
              const option = document.createElement('option');
              option.value = ticker.tkr;
              option.text = ticker.tkr;
              dropdown.add(option);
          }
      
          });
        })
        .catch(error => console.error('Error fetching tickers:', error));
    }
  }, [fundName]);

    useEffect(() => {
    if (fundName.trim() !== '' && tickername.trim() !== '') {
      // Fetch prices based on the selected fund and ticker
      fetch(`http://127.0.0.1:5000/api/getAllPrices/${fundName}/${tickername}`, {
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setPrices(data.data);
          console.log('prices fetched from API', data.data);
        })
        .catch(error => console.error('Error fetching prices:', error));
    }
  }, [fundName, tickername]);
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox mt={4}>
          <SoftBox my={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <SoftBox
                  border={`${borderWidth[1]} solid ${borderColor}`}
                  borderRadius="lg"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                >
                  <label htmlFor="fundDropdown" style={{ marginRight: '10px' }}>Select a Fund</label>
                  <select
                    id="fundDropdown"
                    onChange={(e) => setFundName(e.target.value)}
                    value={fundName}
                    style={{
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '5px',
                      border: `1px solid ${borderColor}`,
                      width: '200px',
                    }}
                  ></select>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={5}>
                <SoftBox
                  border={`${borderWidth[1]} solid ${borderColor}`}
                  borderRadius="lg"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                >
                  <label htmlFor="tickerDropdown" style={{ marginRight: '10px' }}>Select a Ticker</label>
                  <select
                    id="tickerDropdown"
                    onChange={(e) => setTickerName(e.target.value)}
                    value={tickername}
                    style={{
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '5px',
                      border: `1px solid ${borderColor}`,
                      width: '200px',
                    }}
                  ></select>
                </SoftBox>
              </Grid>
              {fundName.trim() !== '' && tickername.trim() !== '' && (
                <Grid item xs={12} md={2} container justifyContent="center" alignItems="center">
                  <SoftBox>
                    <SoftButton variant="contained" color="primary" onClick={handleCreateModel}>
                      Predict Prices
                    </SoftButton>
                  </SoftBox>
                </Grid>
              )}
            </Grid>
          </SoftBox>
          {(fundName.trim() !== '' && tickername.trim() !== '') && (
            <SoftBox position="relative" height="500px">
              {isPredicting ? (
                <SPLoader />
              ) : prices.length > 0 ? (
                <StocksGraph prices={prices} />
              ) : (
<p style={{ color: "red" }}><strong>No prices are found for the selected fund and ticker.</strong></p>
              )}
            </SoftBox>
          )}
        </SoftBox>
        <Footer />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default BillingPrices;



