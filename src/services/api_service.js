// src/services/ApiServices.js
import axios from "axios";



// Example environment config
import { apiUrl } from "./enviornment.js";

// Local storage key
const ACCESS_TOKEN_KEY = "accessToken";

// Default headers
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Generate token headers
const headersToken = (token) => ({
  ...defaultHeaders,
  Authorization: `Bearer ${token}`,
});

// API response class
export class APIDataClass {
  constructor({ message = "No data", isSuccess = false, data = null ,access_token=null,meta=null}) {
    this.message = message;
    this.isSuccess = isSuccess;
    this.data = data;
    this.access_token=access_token;
    this.meta=meta;
  }
}

// Helper: check network connectivity
export const isNetworkConnection = async () => {
  try {
    const online = window.navigator.onLine;
    return online;
  } catch (err) {
    return false;
  }
};

// Main API Service
export class ApiServices {
  static conversationHistory = [];

  // Build full URL with query params
  static getFullUrl(apiName, params = []) {
    let url = apiName;
    if (params && Object.keys(params).length) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    url += `?${queryString}`;
  }
  return apiName.startsWith("http") ? url : `${apiUrl}${url}`;
  }

  // GET request
  static async getApi(apiName, params = [], { isToken = false, isData = false, isMessage = true } = {}, navigate, token = null) {
    
    const fullUrl = this.getFullUrl(apiName,params ? params : {});
  

    const apiData = new APIDataClass({});
    const isInternet = await isNetworkConnection();
    if (!isInternet) {
      apiData.message = "No Internet Access";
      return apiData;
    }

    try {
     
      const response = await axios.get(fullUrl, {
        headers: isToken ? headersToken(token) : defaultHeaders,
      });
      


      if (response.status === 200 || response.status === 201) {
        
        const data = response.data;
        apiData.isSuccess = true;
         const meta = response?.data?.meta;
         apiData.meta=meta;
        apiData.data = isData ? data : data?.data || null;
        apiData.message = isMessage ? data?.message || "" : "";
      } else {
        apiData.message = "No Internet Access";
      }
    } catch (e) {
  //  console.log("Axios error:", e); // full error
  // console.log("Status:", e.response?.status); // 401, 500, etc.
  // console.log("Server response:", e.response?.data); // message from server

  if (e.response?.status === 401) {
   // localStorage.removeItem(ACCESS_TOKEN_KEY);
    // Here you can pass navigate or trigger a logout
  }
       if (e.response?.status === 401) {
    //  localStorage.removeItem(ACCESS_TOKEN_KEY);
     navigate("/login", { replace: true }); // or use your router navigate
      return e; // stop further processing
    }
    
      apiData.message = e.response?.data?.message || e.message || "Server error";
    }

    return apiData;
  }

  // POST request
  static async postApi(apiName, body = {}, { isToken = false, isData = false } = {}, token = null) {
   
    const apiData = new APIDataClass({});
    const isInternet = await isNetworkConnection();
    if (!isInternet) {
      apiData.message = "No Internet Access";
      return apiData;
    }

    try {
     
      const response = await axios.post(apiName, body, {
        headers: isToken ? headersToken(token) : defaultHeaders,
      });

      if (response.status === 200 || response.status === 201) {
        
        const data = response.data;
        const access_token = response?.data?.access_token;
        apiData.isSuccess = true;
        apiData.access_token = access_token;
         apiData.data = isData ? data : data?.data || null;
        apiData.message = data?.message || "";
        // if (apiName.includes("login") || apiName.includes("register")) {
        //   localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
        // }
      } else {
        apiData.message = response.data?.message || "Server error";
      }
    } catch (e) {
        if (e.response?.status === 401) {
     // localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = "/login"; // or use your router navigate
      return; // stop further processing
    }
      apiData.message = e.response?.data?.message || e.message || "Server error";
    }

    return apiData;
  }

  // PUT request
  static async putApi(apiName, body = {}, { isToken = false, isData = false } = {} , token = null) {
    const apiData = new APIDataClass({});
    const isInternet = await isNetworkConnection();
    if (!isInternet) {
      apiData.message = "No Internet Access";
      return apiData;
    }

    try {
     
      const response = await axios.put(apiName, body, {
        headers: isToken ? headersToken(token) : defaultHeaders,
      });

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        apiData.isSuccess = true;
        apiData.data = isData ? data : data?.data || null;
        apiData.message = data?.message || "";
      } else {
        apiData.message = response.data?.message || "Server error";
      }
    } catch (e) {
    //  console.log(e)
        if (e.response?.status === 401) {
    //  localStorage.removeItem(ACCESS_TOKEN_KEY);
     // or use your router navigate
      return e; // stop further processing
    }
      apiData.message = e.response?.data?.message || e.message || "Server error";
    }

    return apiData;
  }

  // DELETE request
  static async deleteApi(apiName, body = {}, { isToken = false } = {} , token = null) {
    const apiData = new APIDataClass({});
    const isInternet = await isNetworkConnection();
    if (!isInternet) {
      apiData.message = "No Internet Access";
      return apiData;
    }

    try {
   
      const response = await axios.delete(apiName, {
        data: body,
        headers: isToken ? headersToken(token) : defaultHeaders,
      });

      if (response.status === 200) {
        const data = response.data;
        apiData.isSuccess = true;
        apiData.data = data?.data || null;
        apiData.message = data?.message || "";
      } else {
        apiData.message = response.data?.message || "Server error";
      }
    } catch (e) {
        if (e.response?.status === 401) {
    //  localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = "/login"; // or use your router navigate
      return; // stop further processing
    }
      apiData.message = e.response?.data?.message || e.message || "Server error";
    }

    return apiData;
  }


  static async patchApi(apiName, body = {}, { isToken = false, isData = false } = {}, token = null) {
  const apiData = new APIDataClass({});
  const isInternet = await isNetworkConnection();
  if (!isInternet) {
    apiData.message = "No Internet Access";
    return apiData;
  }

  try {
   
    const response = await axios.patch(apiName, body, {
      headers: isToken ? headersToken(token) : defaultHeaders,
    });

    if (response.status === 200 || response.status === 201) {
      const data = response.data;
      apiData.isSuccess = true;
      apiData.data = isData ? data : data?.data || null;
      apiData.message = data?.message || "";
    } else {
      apiData.message = response.data?.message || "Server error";
    }
  } catch (e) {
    if (e.response?.status === 401) {
     // localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = "/login";
      return;
    }
    apiData.message = e.response?.data?.message || e.message || "Server error";
  }

  return apiData;
}


}
