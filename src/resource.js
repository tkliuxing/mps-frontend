import qs from "qs";
import { requests } from "./main";

export const getObj = async (resource, pk, params = null) => {
  if (!!params) {
    let resp = await requests.get(`/${resource}/${pk}/`, {
      params,
      paramsSerializer: (paramss) => qs.stringify(paramss, { indices: false }),
    });
    return resp.data;
  } else {
    let resp = await requests.get(`/${resource}/${pk}/`);
    return resp.data;
  }
};

export const getList = async (resource, params, page = 0, pageSize = 0) => {
  if (page && pageSize) {
    params.page = page;
    params.pageSize = pageSize;
  }
  let resp = await requests.get(`/${resource}/`, {
    params,
    paramsSerializer: (paramss) => qs.stringify(paramss, { indices: false }),
  });
  return resp.data;
};

export const createObj = async (resource, data) => {
  let resp = await requests.post(`/${resource}/`, data);
  return resp.data;
};

export const deleteObj = async (resource, pk, params) => {
  return await requests.delete(`/${resource}/${pk}/`, { params });
};

export const updateObj = async (resource, pk, data) => {
  let resp = await requests.put(`/${resource}/${pk}/`, data);
  return resp.data;
};

export const patchObj = async (resource, pk, data) => {
  let resp = await requests.patch(`/${resource}/${pk}/`, data);
  return resp.data;
};

export const getObjFromList = async (resource, params) => {
  if (!params.hasOwnProperty("page")) {
    params.page = 1;
  }
  if (!params.hasOwnProperty("pageSize")) {
    params.pageSize = 1;
  }
  let resp = await requests.get(`/${resource}/`, { params });
  let dd = resp.data;
  if (dd.hasOwnProperty("count") && dd.hasOwnProperty("next") && dd.count > 0) {
    return resp.data.data[0];
  } else {
    if (dd.length > 0) {
      return resp.data[0];
    }
  }
};

export default {
  getObj,
  getList,
  getObjFromList,
  createObj,
  deleteObj,
  updateObj,
  patchObj,
};
