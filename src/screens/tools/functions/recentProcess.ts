import Axios from "../../../scripts/axios";

export const RecentProcessedImages = async (token: any) => {
  const response = await Axios.get(`/processes/recent`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.simplified || [];
};
