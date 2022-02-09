import React, { Fragment, useState, useEffect } from "react";
import * as adminService from "../../services/adminService";
import toastr from "toastr";
import Chart from "react-apexcharts";
import { Card, ButtonGroup, Menu, MenuItem, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import debug from "sabio-debug";
const _logger = debug.extend("SubscriptionChart");

export default function SubscriptionChart() {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [title, setTitle] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    let year = e.target.id;
    if (year && year > 0) {
      adminService
        .getYearSubsNumber(year)
        .then(onGetYearSubsNumberSuccess)
        .catch(onGetYearSubsNumberError);
    }
  };

  const chartDataAndOptions = (response) => {
    let premName = response.item.premium[0].name;
    let stanName = response.item.standard[0].name;
    let premData = response.item.premium.map((prem) => prem.count);
    let stanData = response.item.standard.map((stan) => stan.count);
    let stanMonths = response.item.standard.map((stan) => stan.monthName);

    const yearChartData = [
      {
        name: stanName,
        data: stanData,
        color: "#00ff00",
      },
      {
        name: premName,
        data: premData,
        color: "#0d25d6",
      },
    ];
    const yearChartOptions = {
      chart: {
        toolbar: {
          show: true,
        },
        sparkline: {
          enabled: false,
        },
        events: {
          click: function (event, chartContext, config) {
            if (config.dataPointIndex >= 0) {
              _logger(config.dataPointIndex + 1);
              let monthNumber = config.dataPointIndex + 1;
              let yearNumber =
                response.item.standard[0].yearNumber ||
                response.item.premium[0].yearNumber;

              adminService
                .getMonthSubsNumber(monthNumber, yearNumber)
                .then(onGetMonthSubsNumberSuccess)
                .catch(oneGetMonthSubsNumberError);
            }
          },
        },
      },
      dataLabels: {
        style: {
          colors: ["#ffffff"],
        },
      },
      fill: {
        opacity: 0.85,
        colors: ["#f4772e", "#4191ff"],
      },
      xaxis: {
        tickPlacement: "on",
        categories: stanMonths,
        title: {
          text: "Month",
        },
      },
      yaxis: {
        title: {
          text: "Subscriptions",
        },
      },
    };
    setChartData(yearChartData);
    setChartOptions(yearChartOptions);

    setTitle(
      `${
        response.item.standard[0].yearNumber ||
        response.item.premium[0].yearNumber
      } Subscriptions `
    );
  };

  const chartWeeklyDataAndOptions = (response) => {
    let markerOne = response.item[0].name;
    let markerTwo = null;

    let weekTrakerOne = [];
    let weekTrakerTwo = [];

    for (let i = 0; i < response.item.length; i++) {
      const currentItem = response.item[i].name;

      if (currentItem !== markerOne) {
        markerTwo = currentItem;
      }
    }
    response.item.map((element) => {
      if (element.name === markerOne) {
        weekTrakerOne.push(element.count);
      } else if (element.name === markerTwo) {
        _logger("markerTwo", markerTwo);
        weekTrakerTwo.push(element.count);
      }
    });
    let weeks = response.item.map((days) => days.weekNumber);
    let uniq = [...new Set(weeks)];
    let sortedWeeks = uniq.sort(function (a, b) {
      return a - b;
    });
    const weekChartData = [
      {
        name: markerOne,
        data: weekTrakerOne,
        color: "#0d25d6",
      },
      {
        name: markerTwo,
        data: weekTrakerTwo,
        color: "#00ff00",
      },
    ];

    const weekChartOptions = {
      chart: {
        toolbar: {
          show: true,
        },
        sparkline: {
          enabled: false,
        },
        events: {
          click: function (event, chartContext, config) {
            if (config.dataPointIndex >= 0) {
              _logger(config.dataPointIndex + 1);
              let yearNumber = response.item[0].yearNumber;

              adminService
                .getYearSubsNumber(yearNumber)
                .then(onGetYearSubsNumberSuccess)
                .catch(onGetYearSubsNumberError);
            }
          },
        },
      },
      dataLabels: {
        style: {
          colors: ["#ffffff"],
        },
      },
      fill: {
        opacity: 0.85,
        colors: ["#f4772e", "#4191ff"],
      },
      xaxis: {
        tickPlacement: "on",
        categories: sortedWeeks,
        title: {
          text: "Week Number",
        },
      },
      yaxis: {
        title: {
          text: "Subscriptions",
        },
      },
    };
    setChartData(weekChartData);
    setChartOptions(weekChartOptions);
  };
  const onGetMonthSubsNumberSuccess = (response) => {
    _logger("onGetMonthSubsNumberSuccess", response);
    chartWeeklyDataAndOptions(response);
  };

  const oneGetMonthSubsNumberError = (err) => {
    _logger("oneGetMonthSubsNumberError", err);
    toastr.error("Unable to retrieve subscriptions number per month");
  };

  const onGetYearSubsNumberSuccess = (response) => {
    _logger("onGetYearSubsNumberSuccess", response);
    chartDataAndOptions(response);
  };

  const onGetYearSubsNumberError = (err) => {
    _logger("onGetYearSubsNumberError", err);
    toastr.error("Unable to retrieve subscriptions numbers");
  };

  useEffect(() => {
    adminService
      .getYearSubsNumber("2022")
      .then(onGetYearSubsNumberSuccess)
      .catch(onGetYearSubsNumberError);
  }, []);

  return (
    <Fragment>
      <Card
        key={`SubscriptionChart ${1}`}
        className="card-box mb-4 px-4 pt-4 text-center shadow-sm"
      >
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="split button"
        >
          <Button>Select Year</Button>
          <Button
            color="primary"
            size="small"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Menu
          id="simple-menu2"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            key={`SubscriptionChart ${3}`}
            id="2022"
            onClick={handleClose}
          >
            2022
          </MenuItem>
          <MenuItem
            key={`SubscriptionChart ${4}`}
            id="2021"
            onClick={handleClose}
          >
            2021
          </MenuItem>
        </Menu>
        <span className="font-weight-bold font-size-xl mx-4 text-black">
          {title}
        </span>

        <Chart
          options={chartOptions}
          series={chartData}
          type="bar"
          height={410}
        />
      </Card>
    </Fragment>
  );
}
