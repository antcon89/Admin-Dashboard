import React, { useState, useEffect } from "react";
import * as adminService from "../../services/adminService";
import toastr from "toastr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  Tooltip,
} from "@material-ui/core";

import debug from "sabio-debug";
const _logger = debug.extend("TotalActiveSubsCard");

export default function TotalActiveSubsCard() {
  const [subCount, setsubCount] = useState([]);

  const onGetActiveSubscriptionCountSuccess = (response) => {
    _logger("onGetActiveSubscriptionCountSuccess", response);
    setsubCount(() => [[response.items.map(mapSubCount)]]);
  };

  const onetActiveSubscriptionCountError = (err) => {
    _logger("onetActiveSubscriptionCountError", err);
    toastr.error("Unable to retrieve subscription Count");
  };

  useEffect(() => {
    adminService
      .getActiveSubscriptionCount()
      .then(onGetActiveSubscriptionCountSuccess)
      .catch(onetActiveSubscriptionCountError);
  }, []);

  function mapSubCount(sub) {
    return (
      <ListItem
        key={`SubType ` + sub.id}
        className="hover-show-hide-container d-flex justify-content-between align-items-center py-2 border-0"
      >
        {sub.name === "Standard" ? (
          <span className="badge-circle mt-2 mr-2 align-self-start badge badge-success">
            Basic1
          </span>
        ) : (
          <span className="badge-circle mt-2 mr-2 align-self-start badge badge-primary">
            Basic1
          </span>
        )}
        <div className="font-weight-bold flex-grow-1">
          <div className="text-second font-size-lg">{sub.name}</div>
          <span className="opacity-8">
            <FontAwesomeIcon icon={["far", "user"]} className="mr-1" />
            <b className="font-size-lg pr-1">{sub.count}</b>
            subscribers
          </span>
        </div>
        <div className="text-right hover-hide-wrapper">
          {sub.name === "Standard" ? (
            <div className="font-weight-bold font-size-xl text-success">
              $ {sub.cost * sub.count}
            </div>
          ) : (
            <div className="font-weight-bold font-size-xl text-primary">
              $ {sub.cost * sub.count}
            </div>
          )}
          <span className="opacity-7">Total per month</span>
        </div>
        <div className="text-right hover-show-wrapper">
          <Tooltip arrow title="View details">
            <IconButton className="bg-white text-first d-40 rounded-circle p-0 ml-1">
              <FontAwesomeIcon
                icon={["far", "user"]}
                className="font-size-md mx-auto"
              />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Remove">
            <IconButton className="bg-white text-danger d-40 rounded-circle p-0 ml-1">
              <FontAwesomeIcon
                icon={["fas", "times"]}
                className="font-size-md mx-auto"
              />
            </IconButton>
          </Tooltip>
        </div>
      </ListItem>
    );
  }

  return (
    <Card className="card-box shadow-sm mb-3">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="mb-0 py-0 font-weight-bold">Pricing Plans</h4>
        </div>
      </div>
      <CardContent className="p-0">
        <List className="my-0">{subCount}</List>
      </CardContent>
    </Card>
  );
}
