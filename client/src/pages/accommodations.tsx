import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AccommodationSearch from "@/components/accommodation-search";
import AccommodationCard from "@/components/accommodation-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus } from "lucide-react";

interface SearchFilters {
  location: string;
  accommodationType: string;
  minRent: string;
  maxRent: string;
  availableRooms: string;
  university: string;
}

export default function Accommodations() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    accommodationType: "",
    minRent: "",
    maxRent: "",
    availableRooms: "",
    university: "",
  });

  const { data: accommodations, isLoading, error } = useQuery({
    queryKey: ["/api/accommodations", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.location) {
        params.append("city", filters.location);
        params.append("area", filters.location);
      }
      if (filters.accommodationType) params.append("accommodationType", filters.accommodationType);
      if (filters.minRent) params.append("minRent", filters.minRent);
      if (filters.maxRent) params.append("maxRent", filters.maxRent);
      if (filters.availableRooms) params.append("availableRooms", filters.availableRooms);
      if (filters.university) params.append("university", filters.university);

      const response = await fetch(`/api/accommodations?${params}`);
      if (!response.ok) throw new Error("Failed to fetch accommodations");
      return response.json();
    },
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Failed to load accommodations. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Accommodation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find shared accommodation with fellow South African students
          </p>
        </div>
        <Link href="/list-accommodation">
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            List Your Place
          </Button>
        </Link>
      </div>

      <AccommodationSearch onSearch={handleSearch} />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : accommodations?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No accommodations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search filters or check back later for new listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations?.map((accommodation: any) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}