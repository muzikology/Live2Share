import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Wifi, Car, Heart } from "lucide-react";
import { Link } from "wouter";

interface AccommodationCardProps {
  accommodation: {
    id: number;
    title: string;
    description: string;
    address: string;
    area: string;
    city: string;
    province: string;
    monthlyRent: string;
    accommodationType: string;
    totalRooms: number;
    availableRooms: number;
    bathrooms: number;
    hasWifi: boolean;
    hasParking: boolean;
    petsAllowed: boolean;
    images?: string[];
    amenities?: string[];
    nearbyUniversities?: string[];
  };
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const rentPerRoom = accommodation.availableRooms > 0 
    ? Math.round(parseFloat(accommodation.monthlyRent) / accommodation.totalRooms)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {accommodation.images && accommodation.images.length > 0 ? (
          <img
            src={accommodation.images[0]}
            alt={accommodation.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image available</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {accommodation.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{accommodation.area}, {accommodation.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs capitalize">
            {accommodation.accommodationType.replace("_", " ")}
          </Badge>
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Users className="w-3 h-3 mr-1" />
            {accommodation.availableRooms}/{accommodation.totalRooms} available
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
          {accommodation.description}
        </p>

        {/* Quick amenities */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-600 dark:text-gray-400">
          {accommodation.hasWifi && (
            <div className="flex items-center">
              <Wifi className="w-3 h-3 mr-1" />
              WiFi
            </div>
          )}
          {accommodation.hasParking && (
            <div className="flex items-center">
              <Car className="w-3 h-3 mr-1" />
              Parking
            </div>
          )}
          {accommodation.petsAllowed && (
            <div className="flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              Pets OK
            </div>
          )}
        </div>

        {/* Nearby Universities */}
        {accommodation.nearbyUniversities && accommodation.nearbyUniversities.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Near:</p>
            <div className="flex flex-wrap gap-1">
              {accommodation.nearbyUniversities.slice(0, 2).map((uni, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {uni.replace("University of ", "").replace("University", "Uni")}
                </Badge>
              ))}
              {accommodation.nearbyUniversities.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{accommodation.nearbyUniversities.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              R{parseFloat(accommodation.monthlyRent).toLocaleString()}
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span>
            </div>
            {rentPerRoom > 0 && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                ~R{rentPerRoom.toLocaleString()}/room
              </div>
            )}
          </div>
          
          <Link href={`/accommodation/${accommodation.id}`}>
            <Button size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}