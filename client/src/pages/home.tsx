import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, Home, Users, Heart, MapPin, GraduationCap } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Find Your Perfect Match",
      description: "Search for accommodation near your university with compatible roommates."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Student Profiles",
      description: "View detailed profiles to find roommates with similar lifestyles and study habits."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Split Costs",
      description: "Calculate rent splits and share expenses with your roommates."
    },
    {
      icon: <Home className="w-8 h-8 text-purple-600" />,
      title: "List Your Place",
      description: "Property owners can list accommodation and reach student tenants."
    }
  ];

  const accommodationTypes = [
    {
      type: "Student Houses",
      description: "Shared houses perfect for group living",
      count: "50+ available",
      color: "bg-blue-100 text-blue-800"
    },
    {
      type: "Communes",
      description: "Community-focused shared living spaces",
      count: "25+ available",
      color: "bg-green-100 text-green-800"
    },
    {
      type: "Apartments",
      description: "Modern flats for students near universities",
      count: "40+ available",
      color: "bg-purple-100 text-purple-800"
    },
    {
      type: "Backyard Rooms",
      description: "Affordable private rooms with shared facilities",
      count: "30+ available",
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const universities = [
    "University of Cape Town",
    "University of the Witwatersrand",
    "University of KwaZulu-Natal",
    "Stellenbosch University",
    "University of Pretoria",
    "University of Johannesburg"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Perfect Student Accommodation
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with fellow South African students, share costs, and find amazing places to live near your university.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/accommodations">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Search className="w-5 h-5 mr-2" />
                  Find Accommodation
                </Button>
              </Link>
              <Link href="/list-accommodation">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Home className="w-5 h-5 mr-2" />
                  List Your Place
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose StudentShare?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Built specifically for South African students seeking shared accommodation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Accommodation Types */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Accommodation Types
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From shared houses to private rooms, find what suits your lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accommodationTypes.map((accommodation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{accommodation.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {accommodation.description}
                  </p>
                  <Badge className={accommodation.color}>
                    {accommodation.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Universities Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Near Top South African Universities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find accommodation close to your campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((uni, index) => (
            <div key={index} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <GraduationCap className="w-6 h-6 text-blue-600 mr-3" />
              <span className="text-gray-900 dark:text-white font-medium">{uni}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Find Your New Home?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of South African students who've found their perfect accommodation match
          </p>
          <Link href="/accommodations">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Your Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}