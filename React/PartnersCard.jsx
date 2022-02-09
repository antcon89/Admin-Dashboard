import React, { useState, useEffect, Fragment } from "react";
import * as adminService from "../../services/adminService";
import {
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  TextField,
  InputAdornment,
  Button,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import toastr from "toastr";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";

import debug from "sabio-debug";
const _logger = debug.extend("PartnersCard");

export default function PartnersCard() {
  const [partners, setPartners] = useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  const handleChange = (event, value) => {
    if (value) {
      adminService
        .getPartnersPaged(value - 1, 5)
        .then(onGetPartnersPagedSuccess)
        .catch(onGetPartnersPagedError);
    }
  };

  const formatDateTime = (utcDate) => {
    if (utcDate) {
      let date = new Date(Date.parse(utcDate));
      let day = date.toLocaleString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return day;
    } else {
      return "Invalid Date";
    }
  };

  const onGetPartnersPagedSuccess = (response) => {
    _logger("onGetPartnersPagedSuccess", response);
    setPartners(() => [[response.item.pagedItems.map(mapPartners)]]);
    setTotalCount(response.item.totalPages - 1);
  };

  const onGetPartnersPagedError = (err) => {
    _logger("onGetPartnersPagedError", err);
    toastr.error("Unable to retrieve partners");
  };

  const onGetPartnersSearchSuccess = (response) => {
    _logger("onGetPartnersSearchSuccess", response);
    setPartners(() => [[response.item.pagedItems.map(mapPartners)]]);
    setTotalCount(response.item.totalPages - 1);
  };

  const onGetPartnersSearchError = (err) => {
    _logger("onGetPartnersSearchError", err);
    toastr.error("No partners under that Search");
  };

  useEffect(() => {
    adminService
      .getPartnersPaged(0, 5)
      .then(onGetPartnersPagedSuccess)
      .catch(onGetPartnersPagedError);
  }, []);

  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchlick = () => {
    adminService
      .getPartnersSearch(0, 5, searchValue)
      .then(onGetPartnersSearchSuccess)
      .catch(onGetPartnersSearchError);
    setSearchValue("");
  };

  function mapPartners(partner) {
    return (
      <Fragment key={`Partner ` + partner.id}>
        <ListItem className="py-1 border-0">
          <div className="align-box-row w-100">
            <div className="mr-3">
              <div className="bg-neutral-dark text-primary text-center font-size-xl d-60 rounded-sm">
                <div className="avatar-icon-wrapper avatar-icon-lg">
                  <div className="avatar-icon rounded">
                    <img alt="..." src={partner.logo} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-weight-bold d-block my-1 py-1">
                {partner.name}
              </div>
              <div className="text-dark">
                <span className="text-black">{partner.shortDescription}</span>
              </div>
              <div className="text-dark">
                <span className="text-black">{partner.siteUrl}</span>
              </div>
              <div className="text-dark">
                <span className="text-black">
                  {" "}
                  Partner Since: {formatDateTime(partner.dateCreated)}
                </span>
              </div>
            </div>
          </div>
        </ListItem>
        <Divider />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Card className="card-box mb-4 shadow-sm">
        <div className="card-header">
          <div className="card-header--title">
            <h4 className=" font-weight-bold d-flex justify-content-between">
              Partners{" "}
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  adminService
                    .getPartnersPaged(0, 5)
                    .then(onGetPartnersPagedSuccess)
                    .catch(onGetPartnersPagedError)
                }
              >
                <span className="btn-wrapper--icon">
                  <RefreshIcon height="100px" className="font-size-xl " />
                </span>
              </Button>
            </h4>

            <TextField
              className="app-search-input m-0 p-0"
              fullWidth
              value={searchValue}
              onChange={handleSearchChange}
              inputProps={{ "aria-label": "search" }}
              placeholder="  Search partners here…"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Button
                    className="m-0 p-2 ml-n2 mr-2"
                    variant="contained"
                    color="primary"
                    onClick={handleSearchlick}
                  >
                    <SearchIcon className="app-search-icon primary" />
                    <InputAdornment position="start"></InputAdornment>
                  </Button>
                ),
              }}
            ></TextField>
          </div>
        </div>
        <CardContent className="p-0">
          <List className="mb-2">{partners}</List>
        </CardContent>
        <Pagination
          count={totalCount}
          color="primary"
          onChange={handleChange}
          className="my-2"
        />
      </Card>
    </Fragment>
  );
}
