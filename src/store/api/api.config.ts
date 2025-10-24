import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "./baseQueryWithReauth";
import { endpoints } from "../endpoints";
import { Encryption } from "../../utils/encryption";

export const apiConfig = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints: (builder) => ({
    getData: builder.query({
      query: (state) => ({
        url: state.getUrl,
      }),
    }),
    mutateData: builder.mutation({
      query: (state) => ({
        url: state.postUrl,
        method: "POST",
        body: state.request,
      }),
    }),
  }),
});

export const verificationConfig = createApi({
  reducerPath: "verify",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
  }),
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    verifyPayment: builder.mutation({
      query: (state) => {
        const decryptedPublicKey = Encryption.decrypt(state.publicKey);
        return {
          url: endpoints.verifyPayment,
          method: "POST",
          body: state.request,
          headers: {
            Authorization: `Bearer ${JSON.parse(decryptedPublicKey || "")}`,
          },
        };
      },
    }),
  }),
});
export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
export const SOCKET_API = import.meta.env.VITE_APP_SOCKET_API;

export const { useGetDataQuery, useLazyGetDataQuery, useMutateDataMutation } =
  apiConfig;

export const { useVerifyPaymentMutation } = verificationConfig;
