import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Philosophy from "./pages/Philosophy";
import Legal from "./pages/Legal";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminArticleEdit from "./pages/AdminArticleEdit";

/**
 * Design Philosophy: Quantum Futurism with Premium Startup Aesthetic
 * - Dark charcoal/black backgrounds with electric cyan, magenta, blue accents
 * - Quantum wave function symbolism throughout
 * - Glassmorphism cards, particle effects, smooth animations
 * - Premium, cutting-edge $1B startup energy
 */
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/articles"} component={Articles} />
      <Route path={"/articles/:slug"} component={ArticleDetail} />
      <Route path={"/philosophy"} component={Philosophy} />
      <Route path={"/legal"} component={Legal} />
      <Route path={"/admin"} component={AdminLogin} />
      <Route path={"/admin/dashboard"} component={AdminPanel} />
      <Route path={"/admin/articles/new"} component={AdminArticleEdit} />
      <Route path={"/admin/articles/:id/edit"} component={AdminArticleEdit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
