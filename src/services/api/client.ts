import { QueryClient } from "react-query";

import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const queryClient = new QueryClient();
