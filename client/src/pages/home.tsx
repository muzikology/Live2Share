import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertySearch from "@/components/property-search";
import PropertyCard from "@/components/property-card";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { MapPin, Phone, Mail, Star } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: featuredProperties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const handleSearch = (filters: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value as string);
    });
    setLocation(`/properties?${searchParams.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              Discover thousands of properties for sale, rent, or lease in your desired location
            </p>
            
            <PropertySearch onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant="secondary"
                className="bg-white text-primary shadow-sm"
                onClick={() => setLocation("/properties")}
              >
                All
              </Button>
              <Button
                variant="ghost"
                onClick={() => setLocation("/properties?listingType=sale")}
              >
                For Sale
              </Button>
              <Button
                variant="ghost"
                onClick={() => setLocation("/properties?listingType=rent")}
              >
                For Rent
              </Button>
              <Button
                variant="ghost"
                onClick={() => setLocation("/properties?listingType=lease")}
              >
                For Lease
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties?.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => setLocation("/properties")}
              className="px-8 py-3"
            >
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Properties by Location
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find properties in your preferred neighborhood with our interactive map
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 bg-cover bg-center relative hero-section">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-95 rounded-lg p-6 text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Interactive Property Map
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Click to view detailed property locations and information
                  </p>
                  <Button onClick={() => setLocation("/properties")}>
                    Browse Properties
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Information Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Agents</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Work with experienced professionals who know the market
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Agent 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                    alt="Sarah Johnson"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Sarah Johnson</h3>
                    <p className="text-gray-600">Senior Real Estate Agent</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">4.9 (127 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Specializing in luxury residential properties with over 8 years of experience in the San Francisco Bay Area.
                </p>
                <div className="flex space-x-4">
                  <Button className="flex-1" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                    alt="Michael Chen"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Michael Chen</h3>
                    <p className="text-gray-600">Commercial Property Specialist</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">4.8 (89 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Expert in commercial real estate transactions and investment properties with a focus on maximizing ROI for clients.
                </p>
                <div className="flex space-x-4">
                  <Button className="flex-1" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PropertyHub</h3>
              <p className="text-gray-400 mb-6">
                Your trusted partner in real estate. Find, buy, rent, or lease your perfect property with confidence.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Buy Property</a></li>
                <li><a href="#" className="hover:text-white">Rent Property</a></li>
                <li><a href="#" className="hover:text-white">Lease Property</a></li>
                <li><a href="#" className="hover:text-white">Property Management</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Market Reports</a></li>
                <li><a href="#" className="hover:text-white">Mortgage Calculator</a></li>
                <li><a href="#" className="hover:text-white">Neighborhood Guide</a></li>
                <li><a href="#" className="hover:text-white">Buying Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  info@propertyhub.com
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-1" />
                  <span>123 Business Ave<br />San Francisco, CA 94102</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PropertyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
