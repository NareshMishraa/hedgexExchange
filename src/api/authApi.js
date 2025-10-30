import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "./baseQuery";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: rtkBaseQuery,
  endpoints: (builder) => ({
    // User authentication endpoints
    userLogin: builder.mutation({
      query: ({ email, password }) => ({
        method: "POST",
        url: `/auth/login/send-otp`,
        body: { email, password },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/auth/verify-email`,
        body,
      }),
    }),
     verifyLoginOtp: builder.mutation({
      query: (payload) => ({
        url: '/auth/login/verify-otp',
        method: 'POST',
        body: payload,
      }),
    }),
    sendForgotPassword: builder.mutation({
      query: ({ email }) => ({
        method: "POST",
        url: `/auth/send-reset-password-otp`,
        body: { email },
      }),
    }),
    verifyOtpPassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/verify-reset-password-otp',
        method: 'POST',
        body: payload,
      }),
    }),
  resetPassword: builder.mutation({
  query: ({ email, password, confirmPassword }) => ({
    method: "POST",
    url: `/auth/reset-password`,
    body: { email, password, confirmPassword },
  }),
}),

    getUserDetails: builder.query({
      query: () => ({
        method: "GET",
        url: `/auth/user-details`,
      }),
    }),

    // Wallet management endpoints
    addWallet: builder.mutation({
      query: ({ email, walletAddress }) => ({
        method: "POST",
        url: `/auth/user/addWallets`,
        body: { email, walletAddress },
      }),
    }),
    getAllWallets: builder.mutation({
      query: ({ email }) => ({
        method: "POST",
        url: `/auth/get-wallet-status`,
        body: { email },
      }),
    }),
    getWallets: builder.query({
      query: () => ({
        method: "GET",
        url: `/wallet/get-wallets`,
      }),
    }),

    // Trading and exchange endpoints
    getTokens: builder.query({
      query: () => ({
        method: "GET",
        url: `/auth/token-list`,
      }),
    }),
    getQuoteValue: builder.query({
      query: ({ src, dst, amount }) => ({
        method: "GET",
        url: `/auth/fetchQuote?src=${src}&dst=${dst}&amount=${amount}`,
      }),
    }),
    swapData: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/auth/fetch-swap-details`,
        body,
      }),
    }),
    tokenPrice: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/auth/fetchTokenPrice`,
        body,
      }),
    }),
    getAllTokenPrice: builder.query({
      query: () => ({
        url: "/auth/all-token-price",
        method: "GET",
      }),
    }),

    // Portfolio and activity endpoints
    addUpdatePortfolio: builder.mutation({
      query: ({ walletAddress, portfolioValue, activeHedges, totalEarnings, successRate }) => ({
        url: "/auth/add-update-portfolio",
        method: "POST",
        body: { walletAddress, portfolioValue, activeHedges, totalEarnings, successRate },
      }),
    }),
    getAllPortfolios: builder.query({
      query: (walletAddress) => ({
        url: "/auth/all-portfolios",
        method: "POST",
        body: { walletAddress },
      }),
    }),
    getAllRecentActivity: builder.query({
      query: ({ walletAddress, page, limit }) => ({
        url: "/auth/all-recent-activities",
        method: "POST",
        body: { walletAddress, page, limit },
      }),
    }),
    getRecentTrades: builder.query({
      query: ({ walletAddress, page, limit }) => ({
        url: "/auth/recent-trades",
        method: "POST",
        body: { walletAddress, page, limit },
      }),
    }),
  }),
});

export const {
  useUserLoginMutation,
  useVerifyEmailMutation,
  useVerifyLoginOtpMutation,
  useSendForgotPasswordMutation,
  useVerifyOtpPasswordMutation, 
  useResetPasswordMutation,
  useGetUserDetailsQuery,
  useAddWalletMutation,
  useGetAllWalletsMutation,
  useGetWalletsQuery,
  useGetTokensQuery,
  useGetQuoteValueQuery,
  useSwapDataMutation,
  useTokenPriceMutation,
  useGetAllTokenPriceQuery,
  useAddUpdatePortfolioMutation,
  useGetAllPortfoliosQuery,
  useGetAllRecentActivityQuery,
  useGetRecentTradesQuery,
} = authApi;

export default authApi;
