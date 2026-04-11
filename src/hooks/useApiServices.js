// src/hooks/useApiServices.js
import { useLogin } from "../contexts/login_context.jsx";
import { ApiServices } from "../services/api_service.js";

export const useApiServices = () => {
  const { token } = useLogin(); // ✅ safe: hooks used inside another hook

  // Wrap GET
  const getApi = (apiName, params = [], options = {}, navigate) =>
    ApiServices.getApi(apiName, params, options, navigate, token);

  // Wrap POST
  const postApi = (apiName, body = {}, options = {}) =>
    ApiServices.postApi(apiName, body, options, token);

  // Wrap PUT
  const putApi = (apiName, body = {}, options = {}) =>
    ApiServices.putApi(apiName, body, options, token);

  // Wrap DELETE
  const deleteApi = (apiName, body = {}, options = {}) =>
    ApiServices.deleteApi(apiName, body, options, token);

  // Wrap PATCH
  const patchApi = (apiName, body = {}, options = {}) =>
    ApiServices.patchApi(apiName, body, options, token);

  return { getApi, postApi, putApi, deleteApi, patchApi };
};