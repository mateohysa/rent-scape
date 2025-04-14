"use client";

import React from "react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from "@/state/api";
import Card from "@/components/Card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const ManagerProperties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const cognitoId = authUser?.cognitoInfo?.userId || "";
  
  const { data: properties, isLoading, error } = useGetManagerPropertiesQuery(
    cognitoId,
    { skip: !cognitoId }
  );

  if (isLoading) return <Loading />;
  
  if (error) {
    console.error("Error loading properties:", error);
    return <div>Error loading properties. Please try again later.</div>;
  }

  return (
    <div className="dashboard-container">
      <Header
        title="My Properties"
        subtitle="Manage your properties and see tenant information"
      />
      
      <div className="flex justify-end mb-6">
        <Link 
          href="/managers/newproperty" 
          className="flex items-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
          scroll={false}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Property
        </Link>
      </div>

      {(!properties || properties.length === 0) ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Properties Found</h3>
          <p className="text-gray-500 mb-6">You haven't added any properties yet.</p>
          <Link 
            href="/managers/newproperty" 
            className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
            scroll={false}
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              property={property}
              showFavoriteButton={false}
              propertyLink={`/managers/properties/${property.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerProperties; 