import { Manager, Tenant } from "@/types/prismaTypes";
import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createNewUserInDatabase } from "@/lib/utils";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders : async (headers) => {
      const session = await fetchAuthSession();
      const {idToken} = session.tokens ?? {};
      if(idToken){
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    }
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const {idToken} = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint = userRole === "manager" ? `/manager/${user?.id}` : `/tenants/${user?.id}`;

          let userDetailsResponse = await fetchWithBQ(endpoint);

          // if user no exist we will create a new one

          if(userDetailsResponse.error && userDetailsResponse.error.status === 404){
            userDetailsResponse = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBQ
            )
          }

          return {
            data: {
              cognitoInfo: {...user},
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole
            }
          };
        }
        catch(error) {
          return { error: (error as Error).message || "Could not fetch user details" };
        }
      }
    }),
  }),
});
 
export const {
  useGetAuthUserQuery,
} = api;
