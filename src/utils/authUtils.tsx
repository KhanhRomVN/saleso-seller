import axios, { AxiosError, AxiosResponse } from "axios";
import {
  BACKEND_USER_URI,
  BACKEND_ORDER_URI,
  BACKEND_PRODUCT_URI,
  BACKEND_ANALYTICS_URI,
  BACKEND_OTHER_URI,
} from "@/api/index";

type ServiceAPI = "user" | "order" | "product" | "analytics" | "other";

const getBackendURI = (service: ServiceAPI): string => {
  switch (service) {
    case "user":
      return BACKEND_USER_URI;
    case "order":
      return BACKEND_ORDER_URI;
    case "product":
      return BACKEND_PRODUCT_URI;
    case "analytics":
      return BACKEND_ANALYTICS_URI;
    case "other":
      return BACKEND_OTHER_URI;
    default:
      throw new Error("Invalid service API");
  }
};

interface RefreshTokenResponse {
  newAccessToken: string;
  newRefreshToken: string;
  user: {
    user_id: string;
    username: string;
    role: string;
  };
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const refreshTokenAndRetry = async (
  error: AxiosError
): Promise<AxiosResponse> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    if (!isRefreshing) {
      isRefreshing = true;
      const response = await axios.get<RefreshTokenResponse>(
        `${getBackendURI("user")}/auth/refresh/token`,
        {
          headers: { refreshToken },
        }
      );

      const { newAccessToken, newRefreshToken, user } = response.data;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      isRefreshing = false;
      onTokenRefreshed(newAccessToken);

      if (error.config) {
        error.config.headers["accessToken"] = newAccessToken;
        return axios(error.config);
      }
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh((token: string) => {
        if (error.config) {
          error.config.headers["accessToken"] = token;
          resolve(axios(error.config));
        }
      });
    });
  } catch (refreshError) {
    isRefreshing = false;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return Promise.reject(refreshError);
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && error.config) {
      return refreshTokenAndRetry(error);
    }
    return Promise.reject(error);
  }
);

const handleRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<any> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios({
      method,
      url: `${getBackendURI(service)}${url}`,
      data: body,
      headers: { accessToken },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios sẽ tự động xử lý lỗi 401 thông qua interceptor
      throw error;
    }
    throw error;
  }
};

const handlePublicRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<any> => {
  try {
    const response = await axios({
      method,
      url: `${getBackendURI(service)}${url}`,
      data: body,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Authenticated API calls
export const get = <T = any,>(url: string, service: ServiceAPI): Promise<T> =>
  handleRequest("get", url, service);

export const post = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handleRequest("post", url, service, body);

export const put = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handleRequest("put", url, service, body);

export const del = <T = any,>(url: string, service: ServiceAPI): Promise<T> =>
  handleRequest("delete", url, service);

// Public API calls (no authentication required)
export const getPublic = <T = any,>(
  url: string,
  service: ServiceAPI
): Promise<T> => handlePublicRequest("get", url, service);

export const postPublic = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handlePublicRequest("post", url, service, body);

export const putPublic = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handlePublicRequest("put", url, service, body);

export const delPublic = <T = any,>(
  url: string,
  service: ServiceAPI
): Promise<T> => handlePublicRequest("delete", url, service);

export const authUtils = {
  get,
  post,
  put,
  del,
  getPublic,
  postPublic,
  putPublic,
  delPublic,
};
