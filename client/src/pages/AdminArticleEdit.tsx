import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";

const CATEGORIES = [
  "QWAI Philosophy",
  "Quantum Computing",
  "Artificial Intelligence",
  "Cryptography & Security",
  "Energy & Sustainability",
  "Research & Theory",
  "Industry Insights",
];

export default function AdminArticleEdit() {
  const [, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const isNew = !params.id;
  const articleId = params.id ? parseInt(params.id) : undefined;
  const utils = trpc.useUtils();

  // Auth check
  const authCheck = trpc.admin.check.useQuery();
  useEffect(() => {
    if (authCheck.data && !authCheck.data.authenticated) {
      navigate("/admin");
    }
  }, [authCheck.data, navigate]);

  // Form state
  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    author: "Samer Salhi",
    category: "QWAI Philosophy",
    imageUrl: "",
    linkedinUrl: "",
    published: false,
    featured: false,
  });

  const [preview, setPreview] = useState(false);

  // Load existing article if editing
  const articleQuery = trpc.adminArticles.list.useQuery(undefined, {
    enabled: !isNew && authCheck.data?.authenticated === true,
  });

  useEffect(() => {
    if (!isNew && articleQuery.data && articleId) {
      const article = articleQuery.data.find((a) => a.id === articleId);
      if (article) {
        setForm({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          author: article.author,
          category: article.category,
          imageUrl: article.imageUrl ?? "",
          linkedinUrl: article.linkedinUrl ?? "",
          published: article.published,
          featured: article.featured,
        });
      }
    }
  }, [articleQuery.data, articleId, isNew]);

  // Mutations
  const createMutation = trpc.adminArticles.create.useMutation({
    onSuccess: () => {
      toast.success("Article created successfully");
      utils.adminArticles.list.invalidate();
      navigate("/admin/dashboard");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.adminArticles.update.useMutation({
    onSuccess: () => {
      toast.success("Article updated successfully");
      utils.adminArticles.list.invalidate();
      navigate("/admin/dashboard");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content || !form.excerpt) {
      toast.error("Please fill in all required fields");
      return;
    }
    const data = {
      ...form,
      imageUrl: form.imageUrl || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
    };
    if (isNew) {
      createMutation.mutate(data);
    } else if (articleId) {
      updateMutation.mutate({ id: articleId, data });
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: isNew
        ? title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
        : f.slug,
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (authCheck.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-accent text-4xl animate-pulse">ψ</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft size={14} />
                Back
              </Button>
            </Link>
            <span className="text-foreground font-semibold">
              {isNew ? "New Article" : "Edit Article"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border"
              onClick={() => setPreview(!preview)}
            >
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? "Edit" : "Preview"}
            </Button>
            <Button
              className="gap-2 bg-accent text-background hover:bg-accent/90"
              size="sm"
              onClick={handleSubmit}
              disabled={isPending}
            >
              <Save size={14} />
              {isPending ? "Saving..." : "Save Article"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {preview ? (
          /* Preview mode */
          <div className="glass rounded-2xl p-8">
            <div className="mb-4">
              <span className="text-xs font-mono text-accent uppercase tracking-widest">
                {form.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">{form.title || "Untitled"}</h1>
            <p className="text-muted-foreground text-lg mb-8">{form.excerpt}</p>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt={form.title}
                className="w-full rounded-xl mb-8 object-cover max-h-64"
              />
            )}
            <div
              className="prose prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: form.content }}
            />
          </div>
        ) : (
          /* Edit mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title..."
                className="bg-input border-border text-foreground text-lg font-semibold"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                URL Slug <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">/articles/</span>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="article-url-slug"
                  className="bg-input border-border text-foreground font-mono text-sm"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Excerpt <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short description shown in article listings..."
                className="bg-input border-border text-foreground resize-none"
                rows={2}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Content (HTML) <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="<h2>Section Title</h2><p>Article content in HTML...</p>"
                className="bg-input border-border text-foreground font-mono text-sm resize-y"
                rows={16}
              />
              <p className="text-xs text-muted-foreground">
                Supports HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;, &lt;code&gt;
              </p>
            </div>

            {/* Author & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Cover Image URL</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://cdn.example.com/image.webp"
                className="bg-input border-border text-foreground"
              />
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">LinkedIn Post URL</Label>
              <Input
                value={form.linkedinUrl}
                onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                placeholder="https://www.linkedin.com/posts/..."
                className="bg-input border-border text-foreground"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                />
                <Label className="text-sm text-foreground cursor-pointer">Published</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
                <Label className="text-sm text-foreground cursor-pointer">Featured</Label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="submit"
                className="bg-accent text-background hover:bg-accent/90 font-semibold"
                disabled={isPending}
              >
                <Save size={16} className="mr-2" />
                {isPending ? "Saving..." : isNew ? "Create Article" : "Update Article"}
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline" className="border-border" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
