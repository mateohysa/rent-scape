import { useGetPropertyQuery } from "@/state/api";
import { MapPin, Star } from "lucide-react";
import React from "react";

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  // Convert square feet to square meters (1 sq ft ≈ 0.0929 sq m)
  const squareMeters = Math.round(property.squareFeet * 0.0929);

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {property.location?.country} / {property.location?.state} /{" "}
          <span className="font-semibold text-gray-600">
            {property.location?.city}
          </span>
        </div>
        <h1 className="text-3xl font-bold my-5">{property.name}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {property.location?.city}, {property.location?.state},{" "}
            {property.location?.country}
          </span>
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {property.averageRating.toFixed(1)} ({property.numberOfReviews}{" "}
              Reviews)
            </span>
            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="border border-primary-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Monthly Rent</div>
            <div className="font-semibold">
              €{Math.round(property.pricePerMonth * 0.92).toLocaleString()}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bedrooms</div>
            <div className="font-semibold">{property.beds} bd</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bathrooms</div>
            <div className="font-semibold">{property.baths} ba</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Square Meters</div>
            <div className="font-semibold">
              {squareMeters.toLocaleString()} m²
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="my-16">
        <h2 className="text-xl font-semibold mb-5">About {property.name}</h2>
        <p className="text-gray-500 leading-7">
          {property.description}
          Experience resort style luxury living at Seacrest Homes, where the 
          vibrant city life and natural beauty are seamlessly intertwined. Our newly 
          built community features sophisticated two and three-bedroom residences, 
          each complete with high end designer finishes, quartz counter tops, 
          stainless steel appliances, office nook, and a full size in-unit washer 
          and dryer. Find your personal escape at home beside stunning swimming 
          pools and spas with poolside cabanas. Experience your very own oasis 
          surrounded by lavish landscaped courtyards, with indoor/outdoor 
          entertainment seating. By day, lounge in the BBQ area and experience 
          the breath taking unobstructed views stretching from Mount Dajti to 
          downtown Tirana, or watch the beauty of the Tirana skyline light up by night. 
          Start or end your day with a workout in our full-size state of the art fitness 
          club and yoga studio. Save the commute and plan your next meeting in the 
          business centers conference room, adjacent to our internet and coffee lounge. 
          Conveniently located near beautiful Skanderbeg Square with easy access to 
          the main boulevards, exclusive shopping at the Tirana East Gate and TEG 
          Shopping Center, the Grand Park of Tirana, and close to top healthcare 
          facilities including the University Hospital Center of Tirana and American 
          Hospital, rated among the top medical centers in Albania. Contact us today 
          to tour and embrace the Seacrest luxury lifestyle as your own. Seacrest Homes 
          Apartments is an apartment community located in Tirana's vibrant center and 
          offers proximity to all the cultural and economic advantages of Albania's 
          capital city.
        </p>
      </div>
    </div>
  );
};

export default PropertyOverview;