import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: string, listingType: string) => {
    const numPrice = parseFloat(price);
    if (listingType === "sale") {
      return `$${numPrice.toLocaleString()}`;
    } else {
      return `$${numPrice.toLocaleString()}/mo`;
    }
  };

  const getBadgeColor = (listingType: string) => {
    switch (listingType) {
      case "sale":
        return "bg-accent";
      case "rent":
        return "bg-primary";
      case "lease":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="property-card">
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
          alt={property.title}
          className="property-image"
        />
        <div className={`property-badge ${getBadgeColor(property.listingType)}`}>
          For {property.listingType === "sale" ? "Sale" : property.listingType === "rent" ? "Rent" : "Lease"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
          <p className="text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.city}, {property.state}</span>
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(property.price, property.listingType)}
          </div>
          <div className="flex space-x-4 text-sm text-gray-600">
            {property.bedrooms && (
              <span className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                {property.bathrooms}
              </span>
            )}
            {property.squareFootage && (
              <span className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                {property.squareFootage.toLocaleString()} ft²
              </span>
            )}
          </div>
        </div>
        
        <Link href={`/property/${property.id}`}>
          <Button className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
