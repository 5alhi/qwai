import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ExternalLink,
  TrendingUp,
  Database,
} from "lucide-react";

export const ADMIN_TOKEN_KEY = "qwai_admin_token";

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));

  // Check auth via token
  const authCheck = trpc.admin.check.useQuery(
    { token: token ?? undefined },
    { enabled: !!token }
  );

  useEffect(() => {
    // If no token or token is invalid, redirect to login
    if (!token || (authCheck.data && !authCheck.data.authenticated)) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      navigate("/admin");
    }
  }, [token, authCheck.data, navigate]);

  // Articles list: passes token via headers (handled by trpc client)
  const articlesQuery = trpc.adminArticles.list.useQuery(undefined, {
    enabled: authCheck.data?.authenticated === true,
  });

  // Logout
  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const deleteMutation = trpc.adminArticles.delete.useMutation({
    onSuccess: () => {
      toast.success("Article deleted");
      utils.adminArticles.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const togglePublishMutation = trpc.adminArticles.togglePublish.useMutation({
    onSuccess: (data) => {
      toast.success(data?.published ? "Article published" : "Article unpublished");
      utils.adminArticles.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const seedMutation = trpc.adminArticles.seedFoundationalContent.useMutation({
    onSuccess: (data) => {
      toast.success(`Seed complete: ${data.inserted} inserted, ${data.skipped} skipped`);
      utils.adminArticles.list.invalidate();
    },
    onError: (err) => toast.error(`Seed failed: ${err.message}`),
  });

  const toggleFeaturedMutation = trpc.adminArticles.update.useMutation({
    onSuccess: () => {
      toast.success("Article updated");
      utils.adminArticles.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!token || authCheck.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-accent text-4xl animate-pulse">ψ</div>
      </div>
    );
  }

  if (!authCheck.data?.authenticated) {
    return null;
  }

  const articles = articlesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold glow-cyan text-accent">ψ</span>
            <div>
              <span className="font-bold text-foreground">qw.ai</span>
              <span className="text-muted-foreground ml-2 text-sm">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm" className="gap-2 border-border text-[#00d4ff] border-[#00d4ff]/40 hover:bg-[#00d4ff]/10">
                <TrendingUp size={14} />
                Analytics
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10"
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              title="Seed Article #3 and 20 Foundational Papers into the database (safe to run multiple times)"
            >
              <Database size={14} />
              {seedMutation.isPending ? "Seeding..." : "Seed Articles"}
            </Button>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 border-border">
                <ExternalLink size={14} />
                View Site
              </Button>
            </a>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Articles", value: articles.length },
            { label: "Published", value: articles.filter((a) => a.published).length },
            { label: "Drafts", value: articles.filter((a) => !a.published).length },
            { label: "Featured", value: articles.filter((a) => a.featured).length },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-accent glow-cyan">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Articles management */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Articles</h2>
          <Link href="/admin/articles/new">
            <Button className="gap-2 bg-accent text-background hover:bg-accent/90">
              <Plus size={16} />
              New Article
            </Button>
          </Link>
        </div>

        {articlesQuery.isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="text-4xl mb-4 text-accent">ψ</div>
            <p className="text-muted-foreground mb-4">No articles yet. Create your first article.</p>
            <Link href="/admin/articles/new">
              <Button className="bg-accent text-background hover:bg-accent/90">
                <Plus size={16} className="mr-2" />
                Create Article
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="glass rounded-xl p-4 flex items-start gap-4 hover:border-accent/30 transition-colors"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-foreground truncate">{article.title}</h3>
                    {article.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                        Featured
                      </Badge>
                    )}
                    <Badge
                      className={
                        article.published
                          ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                          : "bg-muted/50 text-muted-foreground border-border text-xs"
                      }
                    >
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                      {article.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{article.excerpt}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">
                    By {article.author} ·{" "}
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : "Not published"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Toggle publish */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    title={article.published ? "Unpublish" : "Publish"}
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: article.id,
                        published: !article.published,
                      })
                    }
                    disabled={togglePublishMutation.isPending}
                  >
                    {article.published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Button>

                  {/* Toggle featured */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-yellow-400"
                    title={article.featured ? "Remove from featured" : "Mark as featured"}
                    onClick={() =>
                      toggleFeaturedMutation.mutate({
                        id: article.id,
                        data: { featured: !article.featured },
                      })
                    }
                    disabled={toggleFeaturedMutation.isPending}
                  >
                    {article.featured ? <StarOff size={15} /> : <Star size={15} />}
                  </Button>

                  {/* Edit */}
                  <Link href={`/admin/articles/${article.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-accent"
                      title="Edit article"
                    >
                      <Pencil size={15} />
                    </Button>
                  </Link>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    title="Delete article"
                    onClick={() => {
                      if (confirm(`Delete "${article.title}"? This cannot be undone.`)) {
                        deleteMutation.mutate({ id: article.id });
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
