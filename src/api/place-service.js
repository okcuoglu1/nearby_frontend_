import axios from "axios";
import { settings } from "../helpers/settings";


const API_URL = settings.apiURL;


export const getPlaces = (values) => {

  return axios.get(`${API_URL}`, { params: values });
};


