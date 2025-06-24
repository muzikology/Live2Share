import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MortgageCalculator from "@/components/mortgage-calculator";
import ContactForm from "@/components/contact-form";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Heart, 
  Share2,
  ArrowLeft,
  Car,
  Wifi,
  Dumbbell,
  Shield
} from "lucide-react";
import { Link } from "wouter";

export default function PropertyDetails() {
  const { id } = useParams();
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Property not found</h2>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: string, listingType: string) => {
    const numPrice = parseFloat(price);
    if (listingType === "sale") {
      return `$${numPrice.toLocaleString()}`;
    } else {
      return `$${numPrice.toLocaleString()}/month`;
    }
  };

  const getBadgeColor = (listingType: string) => {
    switch (listingType) {
      case "sale":
        return "bg-accent hover:bg-accent/80 text-white";
      case "rent":
        return "bg-primary hover:bg-primary/80 text-white";
      case "lease":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const amenityIcons: Record<string, React.ReactNode> = {
    "Swimming Pool": <Dumbbell className="w-4 h-4" />,
    "Garage": <Car className="w-4 h-4" />,
    "High Speed Internet": <Wifi className="w-4 h-4" />,
    "Fitness Center": <Dumbbell className="w-4 h-4" />,
    "Security": <Shield className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/properties">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative mb-6">
              <img
                src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"}
                alt={property.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getBadgeColor(property.listingType)}>
                  For {property.listingType === "sale" ? "Sale" : property.listingType === "rent" ? "Rent" : "Lease"}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Image Gallery */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mb-8">
                {property.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} - Image ${index + 2}`}
                    className="h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
                {property.images.length > 5 && (
                  <div className="h-24 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <span className="text-gray-600 text-sm font-medium">
                      +{property.images.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-2" />
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {property.bedrooms && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Bed className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Bath className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  {property.squareFootage && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Square className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {property.squareFootage.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                      <div className="text-sm text-gray-600">Year Built</div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities & Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {amenityIcons[amenity] || <Shield className="w-4 h-4" />}
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing and Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatPrice(property.price, property.listingType)}
                    </div>
                    <p className="text-gray-600">
                      {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} •{" "}
                      {property.listingType === "sale" ? "For Sale" : property.listingType === "rent" ? "For Rent" : "For Lease"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      Schedule Viewing
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Contact Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mortgage Calculator */}
              {property.listingType === "sale" && (
                <MortgageCalculator propertyPrice={parseFloat(property.price)} />
              )}

              {/* Contact Form */}
              <ContactForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
