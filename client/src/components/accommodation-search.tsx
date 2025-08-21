import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchFilters {
  location: string;
  accommodationType: string;
  minRent: string;
  maxRent: string;
  availableRooms: string;
  university: string;
}

interface AccommodationSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function AccommodationSearch({ onSearch }: AccommodationSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    accommodationType: "",
    minRent: "",
    maxRent: "",
    availableRooms: "",
    university: "",
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: "",
      accommodationType: "",
      minRent: "",
      maxRent: "",
      availableRooms: "",
      university: "",
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Find Your Perfect Student Accommodation
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location (City/Area)
          </label>
          <Input
            placeholder="e.g., Cape Town, Rosebank"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
          />
        </div>

        {/* University */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Near University
          </label>
          <Select value={filters.university} onValueChange={(value) => updateFilter("university", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any University</SelectItem>
              <SelectItem value="University of Cape Town">UCT</SelectItem>
              <SelectItem value="University of the Witwatersrand">Wits</SelectItem>
              <SelectItem value="University of KwaZulu-Natal">UKZN</SelectItem>
              <SelectItem value="Stellenbosch University">Stellenbosch</SelectItem>
              <SelectItem value="University of Pretoria">UP</SelectItem>
              <SelectItem value="University of Johannesburg">UJ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Accommodation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Accommodation Type
          </label>
          <Select value={filters.accommodationType} onValueChange={(value) => updateFilter("accommodationType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Type</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment/Flat</SelectItem>
              <SelectItem value="commune">Student Commune</SelectItem>
              <SelectItem value="backyard_room">Backyard Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min Rent (Total)
          </label>
          <Input
            type="number"
            placeholder="e.g., 5000"
            value={filters.minRent}
            onChange={(e) => updateFilter("minRent", e.target.value)}
          />
        </div>

        {/* Max Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Rent (Total)
          </label>
          <Input
            type="number"
            placeholder="e.g., 20000"
            value={filters.maxRent}
            onChange={(e) => updateFilter("maxRent", e.target.value)}
          />
        </div>

        {/* Available Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Available Rooms
          </label>
          <Select value={filters.availableRooms} onValueChange={(value) => updateFilter("availableRooms", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1 md:flex-none">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button onClick={clearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}