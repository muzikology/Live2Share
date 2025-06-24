import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

interface SearchFilters {
  location: string;
  propertyType: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
  compact?: boolean;
}

export default function PropertySearch({ onSearch, compact = false }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
  });

  const handleSearch = () => {
    // Clean filters - convert "all" values to empty strings for API
    const cleanedFilters = { ...filters };
    Object.keys(cleanedFilters).forEach(key => {
      if (cleanedFilters[key as keyof SearchFilters] === "all") {
        cleanedFilters[key as keyof SearchFilters] = "";
      }
    });
    onSearch(cleanedFilters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 border">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Enter city, neighborhood, or ZIP"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="pl-10"
            />
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <Button onClick={handleSearch} size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </Label>
          <div className="relative">
            <Input
              id="location"
              placeholder="Enter city, neighborhood, or ZIP"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="pl-10"
            />
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </Label>
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter("propertyType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Type</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Listing Type
          </Label>
          <Select value={filters.listingType} onValueChange={(value) => updateFilter("listingType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="lease">For Lease</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </Label>
          <Input
            type="number"
            placeholder="No limit"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </Label>
          <Select value={filters.bedrooms} onValueChange={(value) => updateFilter("bedrooms", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </Label>
          <Select value={filters.bathrooms} onValueChange={(value) => updateFilter("bathrooms", value)}>
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
      
      <div className="mt-6">
        <Button onClick={handleSearch} className="w-full md:w-auto px-8">
          <Search className="w-4 h-4 mr-2" />
          Search Properties
        </Button>
      </div>
    </div>
  );
}
