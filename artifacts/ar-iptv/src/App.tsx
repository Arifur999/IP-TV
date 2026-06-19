import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import CountryPage from "@/pages/CountryPage";
import CategoryPage from "@/pages/CategoryPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CountriesPage from "@/pages/CountriesPage";
import FavoritesPage from "@/pages/FavoritesPage";
import WatchPage from "@/pages/WatchPage";
import HDPlusPage from "@/pages/HDPlusPage";
import HDPlusWatchPage from "@/pages/HDPlusWatchPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/countries" component={CountriesPage} />
      <Route path="/country/:slug" component={CountryPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/hd-plus" component={HDPlusPage} />
      <Route path="/hd-plus/watch/:id" component={HDPlusWatchPage} />
      <Route path="/watch/:id" component={WatchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
