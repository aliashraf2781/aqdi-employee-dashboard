'use client';
import { axiosInstance } from "@/src/utils/axios";
import { useQuery } from "@tanstack/react-query";

const fetchHome = async (lang, country) => {
    const response = await axiosInstance.get(`/home?country_id=${country}`, {
        headers: { "x-localization": lang },
    });
    return response.data.data;
}

export const useGetHome = (lang, country) => {

  const query = useQuery({
    queryKey: ["home", lang, country],
    queryFn: () => fetchHome(lang, country),
    // only run when we have lang and a country id
    enabled: Boolean(lang) && (country !== undefined && country !== null),
    staleTime: 1000 * 60, // 1 minute (adjust as you want)
    gcTime: 1000 * 60 * 5,
  });

  return query;
};
