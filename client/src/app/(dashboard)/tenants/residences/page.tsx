"use client";

import Loading from "@/components/Loading";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResidencesPage() {
  const router = useRouter();
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const { data: applications, isLoading: applicationsLoading } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo?.userId,
      userType: "tenant"
    },
    { skip: !authUser?.cognitoInfo?.userId }
  );

  useEffect(() => {
    if (!authLoading && !applicationsLoading) {
      // Check if there are any approved applications with properties
      const approvedApplication = applications?.find(app => app.status === "Approved" && app.propertyId);
      
      if (approvedApplication?.propertyId) {
        router.push(`/tenants/residences/${approvedApplication.propertyId}`);
      } else {
        router.push("/tenants/favorites");
      }
    }
  }, [authUser, applications, authLoading, applicationsLoading, router]);

  return <Loading />;
} 