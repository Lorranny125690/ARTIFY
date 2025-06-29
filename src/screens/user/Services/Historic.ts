import Axios from "../../../scripts/axios";
import { ImageType } from "../../../contexts/ImageContext/imageContext";
type Processamento = {
  images: ImageType[];
};

export const fetchLastProcess = async (token: string): Promise<Processamento> => {
  const response = await Axios.get("/processes/recent", {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return response.data;
};
