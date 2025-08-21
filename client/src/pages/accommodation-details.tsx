import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Users, Wifi, Car, Heart, University, Bus } from "lucide-react";
import { Link } from "wouter";
import RoommateProfiles from "@/components/roommate-profiles";
import ApplicationForm from "@/components/application-form";
import RentSplitCalculator from "@/components/rent-split-calculator";

export default function AccommodationDetails() {
  const { id } = useParams();

  const { data: accommodation, isLoading, error } = useQuery({
    queryKey: [`/api/accommodations/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/accommodations/${id}`);
      if (!response.ok) throw new Error("Failed to fetch accommodation");
      return response.json();
    },
  });

  const { data: roommates } = useQuery({
    queryKey: [`/api/accommodations/${id}/roommates`],
    queryFn: async () => {
      const response = await fetch(`/api/accommodations/${id}/roommates`);
      if (!response.ok) throw new Error("Failed to fetch roommates");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Accommodation not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The accommodation you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/accommodations">
            <Button>Back to Accommodations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/accommodations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Accommodations
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          {accommodation.images && accommodation.images.length > 0 && (
            <div className="mb-6">
              <img
                src={accommodation.images[0]}
                alt={accommodation.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              {accommodation.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {accommodation.images.slice(1, 5).map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${accommodation.title} ${index + 2}`}
                      className="h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title and Location */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {accommodation.title}
            </h1>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{accommodation.address}, {accommodation.area}, {accommodation.city}</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="capitalize">
                {accommodation.accommodationType.replace("_", " ")}
              </Badge>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                {accommodation.availableRooms} of {accommodation.totalRooms} rooms available
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {accommodation.description}
            </p>
          </div>

          {/* Amenities & Features */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Amenities & Features
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Wifi className="w-4 h-4 mr-2" />
                <span>{accommodation.hasWifi ? "WiFi Included" : "No WiFi"}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Car className="w-4 h-4 mr-2" />
                <span>{accommodation.hasParking ? "Parking Available" : "No Parking"}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Heart className="w-4 h-4 mr-2" />
                <span>{accommodation.petsAllowed ? "Pets Allowed" : "No Pets"}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium">{accommodation.bathrooms} Bathroom{accommodation.bathrooms > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {accommodation.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nearby Universities */}
          {accommodation.nearbyUniversities && accommodation.nearbyUniversities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Nearby Universities
              </h2>
              <div className="space-y-2">
                {accommodation.nearbyUniversities.map((university: string, index: number) => (
                  <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <University className="w-4 h-4 mr-2" />
                    <span>{university}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transport Links */}
          {accommodation.transportLinks && accommodation.transportLinks.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Transport Links
              </h2>
              <div className="space-y-2">
                {accommodation.transportLinks.map((transport: string, index: number) => (
                  <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Bus className="w-4 h-4 mr-2" />
                    <span>{transport}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {accommodation.houseRules && accommodation.houseRules.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                House Rules
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {accommodation.houseRules.map((rule: string, index: number) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Current Roommates */}
          {roommates && roommates.length > 0 && (
            <RoommateProfiles roommates={roommates} />
          )}
        </div>

        <div className="lg:col-span-1">
          {/* Pricing Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                R{parseFloat(accommodation.monthlyRent).toLocaleString()}/month
              </CardTitle>
              {accommodation.deposit && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deposit: R{parseFloat(accommodation.deposit).toLocaleString()}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <ApplicationForm accommodationId={accommodation.id} />
            </CardContent>
          </Card>

          {/* Rent Split Calculator */}
          <RentSplitCalculator 
            totalRent={parseFloat(accommodation.monthlyRent)}
            totalRooms={accommodation.totalRooms}
            occupiedRooms={accommodation.totalRooms - accommodation.availableRooms}
          />
        </div>
      </div>
    </div>
  );
}