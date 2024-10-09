import axios from "axios";
import { environment } from "./environments/environment";

const axiosInstance = axios.create({
  baseURL: environment.api, // URL base para suas requisições
});


export default axiosInstance;
