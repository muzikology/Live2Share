import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertAccommodationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { z } from "zod";

type FormData = z.infer<typeof insertAccommodationSchema>;

const accommodationTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment/Flat" },
  { value: "commune", label: "Student Commune" },
  { value: "backyard_room", label: "Backyard Room" },
];

const southAfricanProvinces = [
  "Eastern Cape",
  "Free State", 
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape"
];

const southAfricanUniversities = [
  "University of Cape Town",
  "University of the Witwatersrand",
  "University of KwaZulu-Natal",
  "Stellenbosch University",
  "University of Pretoria",
  "Rhodes University",
  "University of Johannesburg",
  "North West University",
  "University of the Free State",
  "University of Limpopo",
  "Nelson Mandela University",
  "University of Fort Hare",
  "University of Zululand",
  "Tshwane University of Technology",
  "Cape Peninsula University of Technology",
  "Durban University of Technology",
  "Vaal University of Technology",
  "Central University of Technology",
  "Mangosuthu University of Technology",
  "University of South Africa (UNISA)",
];

export default function ListAccommodation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertAccommodationSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      area: "",
      city: "",
      province: "",
      postalCode: "",
      monthlyRent: "",
      deposit: undefined,
      accommodationType: "",
      totalRooms: 1,
      availableRooms: 1,
      bathrooms: 1,
      hasWifi: false,
      hasParking: false,
      petsAllowed: false,
      images: [],
      amenities: [],
      nearbyUniversities: [],
      transportLinks: [],
      houseRules: [],
      landlordId: 2, // Default to sample landlord
      isActive: true,
    },
  });

  const createAccommodation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create accommodation");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accommodations"] });
      toast({
        title: "Success!",
        description: "Your accommodation has been listed successfully.",
      });
      setLocation("/accommodations");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create accommodation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createAccommodation.mutate(data);
  };

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

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">List Your Student Accommodation</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Help fellow students find great shared accommodation
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Student House near UCT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your accommodation, what makes it special, and what kind of students would fit well..."
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accommodationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accommodationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Location</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area/Suburb</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Rosebank, Observatory" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cape Town, Johannesburg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {southAfricanProvinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="8001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="monthlyRent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Rent (Total)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="15000"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="15000"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Room Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Room Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="totalRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Rooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availableRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Rooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="hasWifi"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>WiFi Included</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasParking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Parking Available</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="petsAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Pets Allowed</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={createAccommodation.isPending}
                >
                  {createAccommodation.isPending ? "Creating..." : "List Accommodation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}