import React, { useState, useEffect, Fragment } from "react";
import * as adminService from "../../services/adminService";
import {
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Button,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import debug from "sabio-debug";
const _logger = debug.extend("NewSubscriptionsFeed");

export default function NewSubscriptionsFeed() {
  const [latestSubscription, setLatestSubscription] = useState([]);

  const formatDateTime = (utcDate) => {
    if (utcDate) {
      let date = new Date(Date.parse(utcDate));
      let day = date.toLocaleString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return day;
    } else {
      return "Invalid Date";
    }
  };

  const onGetTopSubscriptionsSuccess = (response) => {
    _logger("onGetTopSubscriptionsSuccess", response);
    setLatestSubscription(() => [[response.items.map(mapLatestSubscription)]]);
  };

  const onGetTopSubscriptionsError = (err) => {
    _logger("onGetTopSubscriptionsError", err);
    toastr.error("Unable to retrieve subscription plans");
  };

  useEffect(() => {
    adminService
      .getTopSubscriptions()
      .then(onGetTopSubscriptionsSuccess)
      .catch(onGetTopSubscriptionsError);
  }, []);

  function mapLatestSubscription(oneSubscription) {
    return (
      <Fragment key={`LatestSub ` + oneSubscription.userProfile.id}>
        <ListItem className="py-3 border-0">
          <div className="align-box-row w-100">
            <div className="mr-3">
              <div className="bg-neutral-dark text-primary text-center font-size-xl d-60 rounded-sm">
                <div className="avatar-icon-wrapper avatar-icon-lg">
                  <div className="avatar-icon rounded">
                    <img
                      alt="..."
                      src={oneSubscription.userProfile.avatarUrl}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-weight-bold d-block my-1">
                {oneSubscription.userProfile.firstName +
                  " " +
                  oneSubscription.userProfile.lastName}
              </div>
              <div className="text-dark">
                <span className="text-black">
                  Subscribed to{" "}
                  {oneSubscription.paymentTransaction.subscriptionType.name} for{" "}
                </span>

                {oneSubscription.paymentTransaction.name === "Standard" ? (
                  <span className="text-success font-size-md font-weight-bold">
                    ${oneSubscription.paymentTransaction.subscriptionType.cost}
                  </span>
                ) : (
                  <span className="text-primary font-size-md font-weight-bold">
                    ${oneSubscription.paymentTransaction.subscriptionType.cost}{" "}
                  </span>
                )}
              </div>
              <div className="text-dark">
                <span className="text-black">
                  {formatDateTime(
                    oneSubscription.paymentTransaction.dateCreated
                  )}
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
    <Card
      key={`NewSubscriptionsFeed  + ${1}`}
      className="card-box mb-4 shadow-sm"
    >
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-weight-bold d-flex justify-content-between">
            Latest Subscriptions
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                adminService
                  .getTopSubscriptions()
                  .then(onGetTopSubscriptionsSuccess)
                  .catch(onGetTopSubscriptionsError)
              }
            >
              <span className="btn-wrapper--icon">
                <RefreshIcon height="100px" className="font-size-xl " />
              </span>
            </Button>
          </h4>
        </div>
      </div>
      <CardContent className="p-0">
        <List className="mb-2">{latestSubscription}</List>
      </CardContent>
    </Card>
  );
}
