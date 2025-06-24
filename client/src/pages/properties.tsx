import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/property-card";
import PropertySearch from "@/components/property-search";

export default function Properties() {
  const [location] = useLocation();
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Parse URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split("?")[1] || "");
    const initialFilters: Record<string, string> = {};
    
    for (const [key, value] of urlParams.entries()) {
      initialFilters[key] = value;
    }
    
    setFilters(initialFilters);
  }, [location]);

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams(filters);
      const response = await fetch(`/api/properties?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
  });

  const handleSearch = (searchFilters: any) => {
    const newFilters = { ...searchFilters };
    
    // Clean up empty values
    Object.keys(newFilters).forEach(key => {
      if (!newFilters[key]) {
        delete newFilters[key];
      }
    });
    
    setFilters(newFilters);
    
    // Update URL
    const searchParams = new URLSearchParams(newFilters);
    window.history.pushState({}, "", `/properties?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Properties</h1>
          <PropertySearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              {!isLoading && properties && (
                <p className="text-gray-600">
                  {properties.length} properties found
                  {Object.keys(filters).length > 0 && " matching your criteria"}
                </p>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load properties. Please try again.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && properties && properties.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all properties.
              </p>
            </div>
          )}

          {/* Properties Grid */}
          {!isLoading && !error && properties && properties.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
