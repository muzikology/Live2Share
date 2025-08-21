import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Menu, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();

  const navigation = [
    { name: "Find Accommodation", href: "/accommodations" },
    { name: "List Your Place", href: "/list-accommodation" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Home className="w-6 h-6 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-primary">StudentShare</h1>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.startsWith(item.href.split("?")[0])
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400 hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary">
              <Users className="w-6 h-6" />
            </Button>
            <Button className="hidden sm:inline-flex">
              Student Login
            </Button>
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button className="mt-4">Student Login</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
