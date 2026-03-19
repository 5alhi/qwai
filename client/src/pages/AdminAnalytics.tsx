import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import {
  Eye, Users, TrendingUp, Globe, Smartphone, Monitor,
  Tablet, ArrowLeft, RefreshCw, Mail, FileText, MapPin,
  Clock, MousePointer, Zap, Search, ChevronRight, X,
  Activity, Wifi, BarChart2, Target,
} from "lucide-react";

function getAdminToken() {
  return localStorage.getItem("qwai_admin_token") ?? "";
}

const QUANTUM_COLORS = ["#00d4ff", "#ff00ff", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6"];

// ─── Shared Components ────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-start gap-4">
      <div className="p-3 rounded-lg shrink-0" style={{ background: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-white/50 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-white/40 mt-1 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, color, children }: {
  title: string; icon: React.ElementType; color: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color }} />
        {title}
      </h2>
      {children}
    </div>
  );
}

function BarList({ items, maxCount, colorIndex = 0 }: {
  items: { label: string; count: number; badge?: string }[];
  maxCount: number;
  colorIndex?: number;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-white/30 w-5 text-right shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white/80 truncate">{item.label || "Direct"}</span>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${QUANTUM_COLORS[(colorIndex + i) % QUANTUM_COLORS.length]}20`, color: QUANTUM_COLORS[(colorIndex + i) % QUANTUM_COLORS.length] }}>
                    {item.badge}
                  </span>
                )}
                <span className="text-xs text-white/50">{item.count.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.round((item.count / (maxCount || 1)) * 100)}%`,
                  background: QUANTUM_COLORS[(colorIndex + i) % QUANTUM_COLORS.length],
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Hit Detail Modal ─────────────────────────────────────────────────────────

function HitDetailModal({ hitId, onClose }: { hitId: number; onClose: () => void }) {
  const token = getAdminToken();
  const { data, isLoading } = trpc.analytics.hitDetail.useQuery(
    { id: hitId },
    { enabled: !!token }
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#0d0d1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#00d4ff]" />
            Hit #{hitId} Detail
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <div className="p-5 space-y-5">
            {/* Core info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Path", data.hit.path],
                ["Time", new Date(data.hit.createdAt).toLocaleString()],
                ["Session", data.hit.sessionId ? data.hit.sessionId.slice(0, 16) + "..." : "-"],
                ["IP", data.hit.ip ?? "-"],
                ["Country", data.hit.country ? `${data.hit.country} (${data.hit.countryCode})` : "-"],
                ["City", data.hit.city ?? "-"],
                ["Region", data.hit.region ?? "-"],
                ["ISP", data.hit.isp ?? "-"],
                ["Browser", data.hit.browser ? `${data.hit.browser} ${data.hit.browserVersion ?? ""}` : "-"],
                ["OS", data.hit.os ? `${data.hit.os} ${data.hit.osVersion ?? ""}` : "-"],
                ["Device", data.hit.device ?? "-"],
                ["Screen", data.hit.screenWidth ? `${data.hit.screenWidth}x${data.hit.screenHeight}` : "-"],
                ["Viewport", data.hit.viewportWidth ? `${data.hit.viewportWidth}x${data.hit.viewportHeight}` : "-"],
                ["Language", data.hit.language ?? "-"],
                ["Timezone", data.hit.timezone ?? "-"],
                ["Referrer", data.hit.referrerDomain ?? data.hit.referrer ?? "Direct"],
                ["Load Time", data.hit.pageLoadTime ? `${data.hit.pageLoadTime}ms` : "-"],
                ["Scroll Depth", data.hit.scrollDepth ? `${data.hit.scrollDepth}%` : "-"],
                ["Time on Page", data.hit.timeOnPage ? `${data.hit.timeOnPage}s` : "-"],
                ["New Visitor", data.hit.isNewVisitor ? "Yes" : "No"],
              ].map(([label, val]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className="text-sm text-white/80 truncate">{val || "-"}</span>
                </div>
              ))}
            </div>

            {/* UTM params */}
            {(data.hit.utmSource || data.hit.utmMedium || data.hit.utmCampaign) && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">UTM Parameters</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ["Source", data.hit.utmSource],
                    ["Medium", data.hit.utmMedium],
                    ["Campaign", data.hit.utmCampaign],
                    ["Content", data.hit.utmContent],
                    ["Term", data.hit.utmTerm],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5">
                      <span className="text-xs text-white/40">{k}</span>
                      <span className="text-sm text-[#00d4ff]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {data.events.length > 0 && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Events ({data.events.length})</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {data.events.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-3 text-xs bg-white/5 rounded-lg p-2.5">
                      <MousePointer className="w-3.5 h-3.5 text-[#ff00ff] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-white/60 font-medium">{evt.eventType}</span>
                        {evt.eventTarget && <span className="text-white/40 ml-2">{evt.eventTarget}</span>}
                        {evt.eventText && <p className="text-white/50 truncate mt-0.5">{evt.eventText}</p>}
                        <span className="text-white/30">{new Date(evt.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session link */}
            {data.hit.sessionId && (
              <div className="border-t border-white/10 pt-4">
                <SessionTimelineInline sessionId={data.hit.sessionId} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-white/40 text-sm text-center py-8">Hit not found</p>
        )}
      </div>
    </div>
  );
}

function SessionTimelineInline({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false);
  const token = getAdminToken();
  const { data, isLoading } = trpc.analytics.sessionTimeline.useQuery(
    { sessionId },
    { enabled: !!token && open }
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-[#00d4ff] hover:underline flex items-center gap-1"
      >
        <Activity className="w-3 h-3" />
        {open ? "Hide" : "View"} Session Timeline ({sessionId.slice(0, 12)}...)
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {isLoading ? (
            <div className="w-4 h-4 border border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          ) : data ? (
            <>
              <p className="text-xs text-white/40">{data.pageViews.length} pages visited, {data.events.length} events</p>
              {data.pageViews.map((pv, i) => (
                <div key={pv.id} className="flex items-center gap-2 text-xs">
                  <span className="text-white/30 w-4">{i + 1}</span>
                  <span className="text-white/60">{pv.path}</span>
                  <span className="text-white/30 ml-auto">{new Date(pv.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabId = "overview" | "geo" | "tech" | "traffic" | "hits" | "realtime" | "subscribers";

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedHitId, setSelectedHitId] = useState<number | null>(null);
  const [hitSearch, setHitSearch] = useState("");
  const [hitOffset, setHitOffset] = useState(0);
  const HIT_LIMIT = 50;
  const token = getAdminToken();

  const { data: summary, isLoading, refetch } = trpc.analytics.summary.useQuery(
    { days },
    { enabled: !!token }
  );
  const { data: subscribersData } = trpc.analytics.subscribers.useQuery(
    undefined,
    { enabled: !!token && activeTab === "subscribers" }
  );
  const subscribers = subscribersData ?? [];
  const { data: hitsData, isLoading: hitsLoading } = trpc.analytics.hits.useQuery(
    { limit: HIT_LIMIT, offset: hitOffset, search: hitSearch || undefined },
    { enabled: !!token && activeTab === "hits" }
  );
  const { data: realtimeHits, refetch: refetchRealtime } = trpc.analytics.realtime.useQuery(
    { minutes: 60 },
    { enabled: !!token && activeTab === "realtime", refetchInterval: 30000 }
  );

  const deviceData = useMemo(() => {
    if (!summary?.deviceBreakdown) return [];
    return summary.deviceBreakdown.map(d => ({ name: d.device ?? "unknown", value: d.count }));
  }, [summary]);

  const dailyData = useMemo(() => {
    if (!summary?.dailyViews) return [];
    return summary.dailyViews.map(d => ({
      date: d.date ? new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      views: Number(d.count),
      sessions: Number(d.sessions),
    }));
  }, [summary]);

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "geo", label: "Geography", icon: Globe },
    { id: "tech", label: "Technology", icon: Monitor },
    { id: "traffic", label: "Traffic Sources", icon: TrendingUp },
    { id: "hits", label: "All Hits", icon: Eye },
    { id: "realtime", label: "Real-time", icon: Activity },
    { id: "subscribers", label: "Subscribers", icon: Mail },
  ];

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Admin authentication required.</p>
          <Link href="/admin" className="text-[#00d4ff] hover:underline">Back to Admin Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {selectedHitId && (
        <HitDetailModal hitId={selectedHitId} onClose={() => setSelectedHitId(null)} />
      )}

      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Admin
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
            <h1 className="text-lg font-bold">Analytics</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={e => { setDays(Number(e.target.value)); }}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00d4ff]"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button
            onClick={() => { refetch(); refetchRealtime(); }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-white/10 bg-black/20 px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#00d4ff] text-[#00d4ff]"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && activeTab !== "hits" && activeTab !== "realtime" && activeTab !== "subscribers" ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={Eye} label="Page Views" value={(summary?.totalViews ?? 0).toLocaleString()} sub={`Last ${days} days`} color="#00d4ff" />
                  <StatCard icon={Users} label="Unique Sessions" value={(summary?.uniqueSessions ?? 0).toLocaleString()} sub="Anonymous visitors" color="#ff00ff" />
                  <StatCard icon={Zap} label="New Visitors" value={(summary?.newVisitors ?? 0).toLocaleString()} sub="First-time sessions" color="#10b981" />
                  <StatCard icon={Clock} label="Avg Time on Page" value={summary?.avgEngagement?.avgTime ? `${Math.round(Number(summary.avgEngagement.avgTime))}s` : "-"} sub={summary?.avgEngagement?.avgScroll ? `${Math.round(Number(summary.avgEngagement.avgScroll))}% avg scroll` : "No engagement data"} color="#f59e0b" />
                </div>

                {/* Daily views chart */}
                <SectionCard title="Daily Traffic" icon={TrendingUp} color="#00d4ff">
                  {dailyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={dailyData}>
                        <defs>
                          <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#ff00ff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="views" stroke="#00d4ff" strokeWidth={2} fill="url(#viewsGrad)" name="Page Views" />
                        <Area type="monotone" dataKey="sessions" stroke="#ff00ff" strokeWidth={1.5} fill="url(#sessionsGrad)" name="Sessions" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[240px] text-white/30 text-sm">
                      No traffic data yet. Views will appear once visitors arrive.
                    </div>
                  )}
                </SectionCard>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Top Pages */}
                  <SectionCard title="Top Pages" icon={FileText} color="#ff00ff">
                    {summary?.topPages && summary.topPages.length > 0 ? (
                      <BarList
                        items={summary.topPages.map(p => ({ label: p.path, count: p.count }))}
                        maxCount={summary.topPages[0]?.count ?? 1}
                      />
                    ) : <p className="text-white/30 text-sm text-center py-8">No data yet</p>}
                  </SectionCard>

                  {/* Top Articles */}
                  <SectionCard title="Most Read Articles" icon={FileText} color="#f59e0b">
                    {summary?.topArticles && summary.topArticles.length > 0 ? (
                      <BarList
                        items={summary.topArticles.map(a => ({ label: a.articleSlug ?? "unknown", count: a.count }))}
                        maxCount={summary.topArticles[0]?.count ?? 1}
                        colorIndex={4}
                      />
                    ) : <p className="text-white/30 text-sm text-center py-8">No article views yet</p>}
                  </SectionCard>
                </div>

                {/* Engagement metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <StatCard icon={MousePointer} label="Avg Scroll Depth" value={summary?.avgEngagement?.avgScroll ? `${Math.round(Number(summary.avgEngagement.avgScroll))}%` : "-"} color="#7c3aed" />
                  <StatCard icon={Clock} label="Avg Time on Page" value={summary?.avgEngagement?.avgTime ? `${Math.round(Number(summary.avgEngagement.avgTime))}s` : "-"} color="#06b6d4" />
                  <StatCard icon={Wifi} label="Avg Page Load" value={summary?.avgEngagement?.avgLoad ? `${Math.round(Number(summary.avgEngagement.avgLoad))}ms` : "-"} color="#10b981" />
                </div>
              </div>
            )}

            {/* ── GEO TAB ──────────────────────────────────────────────────── */}
            {activeTab === "geo" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <SectionCard title="Top Countries" icon={Globe} color="#00d4ff">
                    {summary?.countryBreakdown && summary.countryBreakdown.length > 0 ? (
                      <BarList
                        items={summary.countryBreakdown.map(c => ({
                          label: c.country ?? "Unknown",
                          count: c.count,
                          badge: c.countryCode ?? undefined,
                        }))}
                        maxCount={summary.countryBreakdown[0]?.count ?? 1}
                      />
                    ) : <p className="text-white/30 text-sm text-center py-8">No geo data yet. Geo lookup activates on the next visit.</p>}
                  </SectionCard>

                  <SectionCard title="Top Cities" icon={MapPin} color="#ff00ff">
                    {summary?.cityBreakdown && summary.cityBreakdown.length > 0 ? (
                      <BarList
                        items={summary.cityBreakdown.slice(0, 10).map(c => ({
                          label: c.city ? `${c.city}, ${c.country ?? ""}` : "Unknown",
                          count: c.count,
                        }))}
                        maxCount={summary.cityBreakdown[0]?.count ?? 1}
                        colorIndex={2}
                      />
                    ) : <p className="text-white/30 text-sm text-center py-8">No city data yet</p>}
                  </SectionCard>
                </div>

                {/* Country bar chart */}
                {summary?.countryBreakdown && summary.countryBreakdown.length > 0 && (
                  <SectionCard title="Country Distribution" icon={BarChart2} color="#7c3aed">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={summary.countryBreakdown.slice(0, 10).map(c => ({ country: c.countryCode ?? c.country ?? "?", views: c.count }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="country" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                          {summary.countryBreakdown.slice(0, 10).map((_, i) => (
                            <Cell key={i} fill={QUANTUM_COLORS[i % QUANTUM_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </SectionCard>
                )}
              </div>
            )}

            {/* ── TECHNOLOGY TAB ───────────────────────────────────────────── */}
            {activeTab === "tech" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Device */}
                  <SectionCard title="Device Type" icon={Monitor} color="#10b981">
                    {deviceData.length > 0 ? (
                      <div className="flex items-center gap-6">
                        <ResponsiveContainer width={160} height={160}>
                          <PieChart>
                            <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                              {deviceData.map((_, i) => (
                                <Cell key={i} fill={QUANTUM_COLORS[i % QUANTUM_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3">
                          {deviceData.map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: QUANTUM_COLORS[i % QUANTUM_COLORS.length] }} />
                              {d.name === "desktop" ? <Monitor className="w-4 h-4 text-white/50" /> : d.name === "mobile" ? <Smartphone className="w-4 h-4 text-white/50" /> : <Tablet className="w-4 h-4 text-white/50" />}
                              <span className="text-sm text-white/70 capitalize">{d.name}</span>
                              <span className="text-sm text-white font-medium ml-auto">{d.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : <p className="text-white/30 text-sm text-center py-8">No device data yet</p>}
                  </SectionCard>

                  {/* Browser */}
                  <SectionCard title="Browsers" icon={Globe} color="#7c3aed">
                    {summary?.browserBreakdown && summary.browserBreakdown.length > 0 ? (
                      <BarList
                        items={summary.browserBreakdown.map(b => ({ label: b.browser ?? "Unknown", count: b.count }))}
                        maxCount={summary.browserBreakdown[0]?.count ?? 1}
                        colorIndex={3}
                      />
                    ) : <p className="text-white/30 text-sm text-center py-8">No browser data yet</p>}
                  </SectionCard>
                </div>

                {/* OS */}
                <SectionCard title="Operating Systems" icon={Target} color="#f59e0b">
                  {summary?.osBreakdown && summary.osBreakdown.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      <BarList
                        items={summary.osBreakdown.map(o => ({ label: o.os ?? "Unknown", count: o.count }))}
                        maxCount={summary.osBreakdown[0]?.count ?? 1}
                        colorIndex={5}
                      />
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={summary.osBreakdown.map(o => ({ name: o.os ?? "Unknown", value: o.count }))}
                            cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}
                          >
                            {summary.osBreakdown.map((_, i) => (
                              <Cell key={i} fill={QUANTUM_COLORS[(i + 5) % QUANTUM_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : <p className="text-white/30 text-sm text-center py-8">No OS data yet</p>}
                </SectionCard>
              </div>
            )}

            {/* ── TRAFFIC SOURCES TAB ──────────────────────────────────────── */}
            {activeTab === "traffic" && (
              <div className="space-y-6">
                <SectionCard title="Referrer Domains" icon={TrendingUp} color="#7c3aed">
                  {summary?.topReferrers && summary.topReferrers.length > 0 ? (
                    <BarList
                      items={summary.topReferrers.map(r => ({ label: r.referrer ?? "Direct", count: r.count }))}
                      maxCount={summary.topReferrers[0]?.count ?? 1}
                      colorIndex={2}
                    />
                  ) : <p className="text-white/30 text-sm text-center py-8">No referrer data yet. Most traffic appears to be direct.</p>}
                </SectionCard>

                {summary?.utmSources && summary.utmSources.length > 0 && (
                  <SectionCard title="UTM Campaign Tracking" icon={Target} color="#f59e0b">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            {["Source", "Medium", "Campaign", "Hits"].map(h => (
                              <th key={h} className="text-left py-2 px-3 text-white/40 font-medium">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {summary.utmSources.map((u, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-2 px-3 text-[#00d4ff]">{u.source ?? "-"}</td>
                              <td className="py-2 px-3 text-white/60">{u.medium ?? "-"}</td>
                              <td className="py-2 px-3 text-white/60">{u.campaign ?? "-"}</td>
                              <td className="py-2 px-3 text-white font-medium">{u.count.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                )}
              </div>
            )}

            {/* ── ALL HITS TAB ─────────────────────────────────────────────── */}
            {activeTab === "hits" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search by path, IP, city, country..."
                      value={hitSearch}
                      onChange={e => { setHitSearch(e.target.value); setHitOffset(0); }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]"
                    />
                  </div>
                  <span className="text-sm text-white/40">
                    {hitsData ? `${hitsData.total.toLocaleString()} total hits` : ""}
                  </span>
                </div>

                {hitsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : hitsData && hitsData.hits.length > 0 ? (
                  <>
                    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                              {["ID", "Time", "Path", "Country", "City", "Browser", "Device", "Scroll", "Time", ""].map(h => (
                                <th key={h} className="text-left py-3 px-3 text-white/40 font-medium whitespace-nowrap">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {hitsData.hits.map((hit) => (
                              <tr
                                key={hit.id}
                                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                onClick={() => setSelectedHitId(hit.id)}
                              >
                                <td className="py-2.5 px-3 text-white/30">#{hit.id}</td>
                                <td className="py-2.5 px-3 text-white/50 whitespace-nowrap">
                                  {new Date(hit.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </td>
                                <td className="py-2.5 px-3 text-white/80 max-w-[180px] truncate">{hit.path}</td>
                                <td className="py-2.5 px-3">
                                  {hit.countryCode ? (
                                    <span className="px-1.5 py-0.5 rounded text-xs bg-[#00d4ff]/10 text-[#00d4ff]">{hit.countryCode}</span>
                                  ) : <span className="text-white/20">-</span>}
                                </td>
                                <td className="py-2.5 px-3 text-white/50 max-w-[100px] truncate">{hit.city ?? "-"}</td>
                                <td className="py-2.5 px-3 text-white/60">{hit.browser ?? "-"}</td>
                                <td className="py-2.5 px-3">
                                  {hit.device === "mobile" ? <Smartphone className="w-3.5 h-3.5 text-white/40" /> : hit.device === "tablet" ? <Tablet className="w-3.5 h-3.5 text-white/40" /> : <Monitor className="w-3.5 h-3.5 text-white/40" />}
                                </td>
                                <td className="py-2.5 px-3 text-white/50">{hit.scrollDepth ? `${hit.scrollDepth}%` : "-"}</td>
                                <td className="py-2.5 px-3 text-white/50">{hit.timeOnPage ? `${hit.timeOnPage}s` : "-"}</td>
                                <td className="py-2.5 px-3">
                                  <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between text-sm text-white/50">
                      <span>Showing {hitOffset + 1}-{Math.min(hitOffset + HIT_LIMIT, hitsData.total)} of {hitsData.total.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setHitOffset(Math.max(0, hitOffset - HIT_LIMIT))}
                          disabled={hitOffset === 0}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setHitOffset(hitOffset + HIT_LIMIT)}
                          disabled={hitOffset + HIT_LIMIT >= hitsData.total}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                    <Eye className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No hits recorded yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── REAL-TIME TAB ────────────────────────────────────────────── */}
            {activeTab === "realtime" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">Last 60 minutes. Auto-refreshes every 30s.</p>
                  <div className="flex items-center gap-2 text-xs text-[#10b981]">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    Live
                  </div>
                </div>

                {realtimeHits && realtimeHits.length > 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5">
                            {["Time", "Path", "Country", "City", "Browser", "Device", "New?"].map(h => (
                              <th key={h} className="text-left py-3 px-3 text-white/40 font-medium">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {realtimeHits.map((hit) => (
                            <tr
                              key={hit.id}
                              className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                              onClick={() => setSelectedHitId(hit.id)}
                            >
                              <td className="py-2.5 px-3 text-white/50 whitespace-nowrap">
                                {new Date(hit.createdAt).toLocaleTimeString()}
                              </td>
                              <td className="py-2.5 px-3 text-white/80 max-w-[200px] truncate">{hit.path}</td>
                              <td className="py-2.5 px-3">
                                {hit.countryCode ? (
                                  <span className="px-1.5 py-0.5 rounded text-xs bg-[#00d4ff]/10 text-[#00d4ff]">{hit.countryCode}</span>
                                ) : <span className="text-white/20">-</span>}
                              </td>
                              <td className="py-2.5 px-3 text-white/50">{hit.city ?? "-"}</td>
                              <td className="py-2.5 px-3 text-white/60">{hit.browser ?? "-"}</td>
                              <td className="py-2.5 px-3">
                                {hit.device === "mobile" ? <Smartphone className="w-3.5 h-3.5 text-white/40" /> : hit.device === "tablet" ? <Tablet className="w-3.5 h-3.5 text-white/40" /> : <Monitor className="w-3.5 h-3.5 text-white/40" />}
                              </td>
                              <td className="py-2.5 px-3">
                                {hit.isNewVisitor ? (
                                  <span className="px-1.5 py-0.5 rounded text-xs bg-[#10b981]/20 text-[#10b981]">New</span>
                                ) : (
                                  <span className="text-white/20">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                    <Activity className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No visitors in the last 60 minutes.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── SUBSCRIBERS TAB ──────────────────────────────────────────── */}
            {activeTab === "subscribers" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{subscribers?.length ?? 0} active subscribers</p>
                </div>
                {subscribers && subscribers.length > 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5">
                            {["Email", "Name", "Source", "Subscribed"].map(h => (
                              <th key={h} className="text-left py-3 px-4 text-white/40 font-medium">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((sub) => (
                            <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-4 text-white/80">{sub.email}</td>
                              <td className="py-3 px-4 text-white/60">{sub.name ?? "-"}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-full text-xs bg-[#10b981]/20 text-[#10b981]">{sub.source}</span>
                              </td>
                              <td className="py-3 px-4 text-white/40">
                                {new Date(sub.subscribedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                    <Mail className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No subscribers yet.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
