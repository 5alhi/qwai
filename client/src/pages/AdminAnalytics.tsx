import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Eye, Users, TrendingUp, Globe, Smartphone, Monitor,
  Tablet, ArrowLeft, RefreshCw, Mail, FileText
} from "lucide-react";

function getAdminToken() {
  return localStorage.getItem("qwai_admin_token") ?? "";
}

const QUANTUM_COLORS = ["#00d4ff", "#ff00ff", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg`} style={{ background: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-white/50 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const token = getAdminToken();

  const { data: summary, isLoading, refetch } = trpc.analytics.summary.useQuery(
    { days },
    { enabled: !!token }
  );
  const { data: subscribers } = trpc.analytics.subscribers.useQuery(
    undefined,
    { enabled: !!token }
  );

  const deviceData = useMemo(() => {
    if (!summary?.deviceBreakdown) return [];
    return summary.deviceBreakdown.map(d => ({
      name: d.device ?? "unknown",
      value: d.count,
    }));
  }, [summary]);

  const dailyData = useMemo(() => {
    if (!summary?.dailyViews) return [];
    return summary.dailyViews.map(d => ({
      date: d.date ? new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      views: d.count,
    }));
  }, [summary]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Admin authentication required.</p>
          <Link href="/admin" className="text-[#00d4ff] hover:underline">← Back to Admin Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Admin Panel
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
            <h1 className="text-lg font-bold">Analytics Dashboard</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00d4ff]"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Eye} label="Total Page Views" value={summary?.totalViews?.toLocaleString() ?? 0} sub={`Last ${days} days`} color="#00d4ff" />
              <StatCard icon={Users} label="Unique Sessions" value={summary?.uniqueSessions?.toLocaleString() ?? 0} sub="Anonymous visitors" color="#ff00ff" />
              <StatCard icon={Mail} label="Newsletter Subscribers" value={subscribers?.length ?? 0} sub="Active subscribers" color="#10b981" />
              <StatCard icon={FileText} label="Top Article Views" value={summary?.topArticles?.[0]?.count ?? 0} sub={summary?.topArticles?.[0]?.articleSlug ?? "—"} color="#f59e0b" />
            </div>

            {/* Daily Views Chart */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00d4ff]" />
                Daily Page Views
              </h2>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                      cursor={{ stroke: "rgba(0,212,255,0.2)" }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#00d4ff" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#00d4ff" }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[220px] text-white/30 text-sm">
                  No data yet — views will appear here once visitors arrive
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Pages */}
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#ff00ff]" />
                  Top Pages
                </h2>
                {summary?.topPages && summary.topPages.length > 0 ? (
                  <div className="space-y-2">
                    {summary.topPages.map((page, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-white/30 w-5 text-right">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white/80 truncate">{page.path}</span>
                            <span className="text-xs text-white/50 ml-2 shrink-0">{page.count}</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.round((page.count / (summary.topPages[0]?.count || 1)) * 100)}%`,
                                background: QUANTUM_COLORS[i % QUANTUM_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center py-8">No page view data yet</p>
                )}
              </div>

              {/* Top Referrers */}
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#7c3aed]" />
                  Traffic Sources
                </h2>
                {summary?.topReferrers && summary.topReferrers.length > 0 ? (
                  <div className="space-y-2">
                    {summary.topReferrers.map((ref, i) => {
                      const domain = ref.referrer ? (() => { try { return new URL(ref.referrer).hostname; } catch { return ref.referrer; } })() : "Direct";
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-white/30 w-5 text-right">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-white/80 truncate">{domain}</span>
                              <span className="text-xs text-white/50 ml-2 shrink-0">{ref.count}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.round((ref.count / (summary.topReferrers[0]?.count || 1)) * 100)}%`,
                                  background: QUANTUM_COLORS[(i + 3) % QUANTUM_COLORS.length],
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center py-8">No referrer data yet</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#10b981]" />
                  Device Breakdown
                </h2>
                {deviceData.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                          {deviceData.map((_, i) => (
                            <Cell key={i} fill={QUANTUM_COLORS[i % QUANTUM_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      {deviceData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: QUANTUM_COLORS[i % QUANTUM_COLORS.length] }} />
                          <span className="text-sm text-white/70 capitalize">{d.name}</span>
                          <span className="text-sm text-white font-medium ml-auto">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center py-8">No device data yet</p>
                )}
              </div>

              {/* Top Articles */}
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#f59e0b]" />
                  Most Read Articles
                </h2>
                {summary?.topArticles && summary.topArticles.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={summary.topArticles.map(a => ({ name: a.articleSlug?.slice(0, 20) + "…", views: a.count }))} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                      <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                      <Bar dataKey="views" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-white/30 text-sm text-center py-8">No article view data yet</p>
                )}
              </div>
            </div>

            {/* Newsletter Subscribers Table */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#10b981]" />
                Newsletter Subscribers ({subscribers?.length ?? 0})
              </h2>
              {subscribers && subscribers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-white/40 font-medium">Email</th>
                        <th className="text-left py-2 px-3 text-white/40 font-medium">Name</th>
                        <th className="text-left py-2 px-3 text-white/40 font-medium">Source</th>
                        <th className="text-left py-2 px-3 text-white/40 font-medium">Subscribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-3 text-white/80">{sub.email}</td>
                          <td className="py-2 px-3 text-white/60">{sub.name ?? "—"}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-[#10b981]/20 text-[#10b981]">{sub.source}</span>
                          </td>
                          <td className="py-2 px-3 text-white/40">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-white/30 text-sm text-center py-8">No subscribers yet — the newsletter signup form will capture emails from visitors</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
