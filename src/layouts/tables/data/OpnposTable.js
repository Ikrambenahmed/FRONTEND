// ... (import statements remain unchanged)
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PropTypes from 'prop-types';

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { Line } from 'react-chartjs-2';

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useEffect } from "react";
import { useState } from "react";
import borders from "assets/theme/base/borders";
import SoftButton from "components/SoftButton";

const OpnposTable = ({ selectedFund }) => {
  console.log('OpnposTable selectedFund',selectedFund)
    const [opnposData, setOpnposData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null); // Add state to track the selected row
    const [priceHistory, setPriceHistory] = useState([]);
    const token = localStorage.getItem('access_token');

    // Fetch Opnpos data from the API based on the selected fund
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/getOpnpos/${selectedFund}`);
          const dataText = await response.text();
          console.log('API response:', dataText);
          const data = JSON.parse(dataText);
          setOpnposData(data.fund_data || []);
          console.log('opnpos data', data.fund_data);
        } catch (error) {
          console.error('Error fetching Opnpos data:', error);
        }
      };
       
      fetchData();
    }, [selectedFund]); // Trigger the fetch when selectedFund changes
  
    const columns = [
      { name: 'FUND', align: 'left', label: 'Fund' },
      { name: 'TKR', align: 'left', label: 'TKR' },
      { name: 'QTY', align: 'left', label: 'Quantity' },
      { name: 'LCL_ACCINC', align: 'left', label: 'Local Account Income' },
      { name: 'ACTION', align: 'left', label: 'Action' }, // Add the action column
      // Add other columns as needed
    ];
      // Step 2: Create state variables for the modal
      const [isModalOpen, setModalOpen] = useState(false);
      const [selectedTicker, setSelectedTicker] = useState('');
    
  // Step 3: Function to handle modal open/close
  const handleModalOpen = (index) => {
    setSelectedRow(index); // Set the selected row index
    const selectedRowData = opnposData[index];
  
    if (selectedRowData && selectedRowData.tkr) {
      setSelectedTicker(selectedRowData.tkr); // Set the selected ticker
    } else {
      // Handle the case where data is not available or does not contain 'tkr'
      console.error('Error: Unable to retrieve ticker information.');
    }
  
    setModalOpen(true);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
  };
  // Step 4: Fetch data for the selected row
  useEffect(() => {
    if (selectedRow !== null) {
      const selectedRowData = opnposData[selectedRow];
      // Fetch additional data for the selected row using selectedRowData.fund and selectedRowData.tkr
      // ...

      // For demonstration purposes, log the selected row data
      console.log('Selected Row Data:', selectedRowData);
    }
  }, [selectedRow, opnposData]);

  const [qtyHistory, setQtyHistory] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Quantity',
        data: [],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        lineTension: 0.1,
      },
    ],
  });
  const updateChartData = (qtyHistory, priceHistory) => {
    const labels = qtyHistory.map((item) => {
      const formattedDate = new Date(item.trade_date).toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      return formattedDate;
    });

    const qtyData = qtyHistory.map((item) => item.remaining_qty);
    const priceData = priceHistory.map((item) => item.price);

    setChartData({
      labels,
      datasets: [
        {
          label: 'QTY',
          data: qtyData,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          lineTension: 0.1,
        },
        {
          label: 'Book Price',
          data: priceData,
          fill: false,
          borderColor: 'rgba(192,75,192,1)',
          lineTension: 0.1,
        },
      ],
    });
  };

  const updateChartDataOLD = (qtyHistory) => {
    const labels = qtyHistory.map((item) => {
      // Format the trade_date using toLocaleDateString
      const formattedDate = new Date(item.trade_date).toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      return formattedDate;
    });
  
    const data = qtyHistory.map((item) => item.remaining_qty);
  
    setChartData({
      labels,
      datasets: [
        {
          label: 'QTY',
          data,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          lineTension: 0.1,
        },
      ],
    });
  };
    // Step 7: Fetch QTY history when both selectedFund and selectedTicker change
    useEffect(() => {
      const fetchHistory = async () => {
        try {
          const qtyResponse = await fetch(
            `http://127.0.0.1:5000/api/getQty/${selectedFund}/${selectedTicker}`
            , {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          const qtyDataText = await qtyResponse.text();
          const qtyData = JSON.parse(qtyDataText);
  
          const priceResponse = await fetch(
            `http://127.0.0.1:5000/api/getCash/${selectedFund}/${selectedTicker}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
          ;
          const priceDataText = await priceResponse.text();
          const priceData = JSON.parse(priceDataText);
  
          if (Array.isArray(qtyData.data) && Array.isArray(priceData.data)) {
            setQtyHistory(qtyData.data);
            setPriceHistory(priceData.data);
            updateChartData(qtyData.data, priceData.data); // Update chart data
          } else {
            console.error('Invalid QTY or Price history data format:', qtyData, priceData);
            setQtyHistory([]);
            setPriceHistory([]);
          }
        } catch (error) {
          console.error('Error fetching QTY or Price history:', error);
          setQtyHistory([]);
          setPriceHistory([]);
        }
      };
  
      // Fetch QTY and Price history only when both selectedFund and selectedTicker are available
      if (selectedFund && selectedTicker) {
        fetchHistory();
      }
    }, [selectedFund, selectedTicker]);
      // Map Opnpos data to table rows
    const rows = opnposData.map((item) => ({
      FUND: item.fund,
      TKR: item.tkr,
      QTY: item.qty,
      LCL_ACCINC: item.lcl_accinc,
      ACTION: (
        <SoftTypography
          component="a"
          href="#"
          variant="caption"
          color="secondary"
          fontWeight="medium"
          onClick={() => handleModalOpen(opnposData.indexOf(item))}
        >
          Details
        </SoftTypography>
      ),
            // Add other columns as needed
    }));

    return (
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Open Positions</SoftTypography>
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
          {/* Step 5: Modal component */}
          <Modal open={isModalOpen} onClose={handleModalClose}>
  <Card
    sx={{
      width: '80%', // Adjust the width as needed
      maxWidth: '800px', // Set a maximum width if necessary
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
              {/* Step 6: Modal content */}
              <SoftBox p={3}>
                <SoftTypography variant="body1">Ticker {selectedTicker} Quantity Movement</SoftTypography>
                <Line data={chartData} />

              </SoftBox>
              <SoftButton onClick={handleModalClose} variant="contained" color="secondary">
                Close
              </SoftButton>
            </Card>
          </Modal>
        </SoftBox>
      </SoftBox>
    );
  };
  
  OpnposTable.propTypes = {
    selectedFund: PropTypes.string.isRequired,
  };
  
  export default OpnposTable;
  