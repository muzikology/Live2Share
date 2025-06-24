import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Properties from "@/pages/properties";
import PropertyDetails from "@/pages/property-details";
import ListProperty from "@/pages/list-property";
import Header from "@/components/header";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/properties" component={Properties} />
        <Route path="/property/:id" component={PropertyDetails} />
        <Route path="/list-property" component={ListProperty} />
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
