import { QueryClient } from "react-query";

import axios from "axios";

export const apiClient = axios.create({
  // TODO replace after project kickoff
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export const queryClient = new QueryClient();
