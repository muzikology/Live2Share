import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Accommodations from "@/pages/accommodations";
import AccommodationDetails from "@/pages/accommodation-details";
import ListAccommodation from "@/pages/list-accommodation";
import Header from "@/components/header";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/accommodations" component={Accommodations} />
        <Route path="/accommodation/:id" component={AccommodationDetails} />
        <Route path="/list-accommodation" component={ListAccommodation} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
