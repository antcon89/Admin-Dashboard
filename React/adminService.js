import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalError,
  onGlobalSuccess,
} from "./serviceHelpers";

const endpoint = `${API_HOST_PREFIX}/api/admins`;

var getTopSubscriptions = () => {
  const config = {
    method: "GET",
    url: endpoint,
    crossdomain: true,
    headers: { "content-type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

var getActiveSubscriptionCount = () => {
  const config = {
    method: "GET",
    url: endpoint + "/subscription/active",
    crossdomain: true,
    headers: { "content-type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

var getYearSubsNumber = (year) => {
  const config = {
    method: "GET",
    url: endpoint + "/year?year=" + year,
    crossdomain: true,
    headers: { "content-type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

var getMonthSubsNumber = (month, year) => {
  const config = {
    method: "GET",
    url: endpoint + `/monthly/subs?month=${month}&year=${year}`,
    crossdomain: true,
    headers: { "content-type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

var getPartnersPaged = (idex, size) => {
  const config = {
    method: "GET",
    url: endpoint + `/paginate/partner?pageIndex=${idex}&pageSize=${size}`,
    crossdomain: true,
    headers: { "content-type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

var getPartnersSearch = (idex, size, search) => {
  const config = {
    method: "GET",
    url:
      endpoint +
      `/search/partner?pageIndex=${idex}&pageSize=${size}&search=${search}`,
    crossdomain: true,
    headers: { "content-type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  getTopSubscriptions,
  getActiveSubscriptionCount,
  getYearSubsNumber,
  getMonthSubsNumber,
  getPartnersPaged,
  getPartnersSearch,
};
