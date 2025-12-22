import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, Calendar } from "lucide-react";
import { apiUrl } from "@/lib/api";

interface AnalyticsData {
  totalMembers: number;
  genderData: Array<{ gender: string; count: number }>;
  provinceData: Array<{ province: string; count: number }>;
  ageStats: { count: number; average: number; minimum: number; maximum: number };
  voterData: Array<{ isRegisteredVoter: string; count: number }>;
  trendData: Array<{ date: string; count: number }>;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

const Analytics = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(apiUrl("/api/analytics"));
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAdminClick={() => {}} />
        <main className="container py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAdminClick={() => {}} />
        <main className="container py-8">
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
            Error: {error}
          </div>
        </main>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header onAdminClick={() => {}} />

      <main className="container max-w-7xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Member registration statistics and insights</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/members")} variant="outline">
              Members List
            </Button>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Members</p>
                <p className="text-3xl font-bold mt-2">{analytics.totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Average Age</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.ageStats?.average ? Math.round(analytics.ageStats.average) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {analytics.ageStats?.minimum || "—"} - {analytics.ageStats?.maximum || "—"}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Registered Voters</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.voterData.find((v) => v.isRegisteredVoter === "yes")?.count || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.totalMembers > 0
                    ? Math.round(
                        ((analytics.voterData.find((v) => v.isRegisteredVoter === "yes")?.count || 0) /
                          analytics.totalMembers) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gender Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Gender Distribution</h2>
            {analytics.genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.genderData}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.genderData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No gender data available</p>
            )}
          </Card>

          {/* Voter Registration Status */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Voter Registration Status</h2>
            {analytics.voterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.voterData}
                    dataKey="count"
                    nameKey="isRegisteredVoter"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ isRegisteredVoter, count }) => `${isRegisteredVoter === "yes" ? "Registered" : "Not Registered"}: ${count}`}
                  >
                    {analytics.voterData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No voter data available</p>
            )}
          </Card>

          {/* Top Provinces */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Top Provinces by Registration</h2>
            {analytics.provinceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.provinceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="province" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No province data available</p>
            )}
          </Card>

          {/* Registration Trend */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Registration Trend (Last 30 Days)</h2>
            {analytics.trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={Math.floor(analytics.trendData.length / 7)}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    dot={false}
                    name="Registrations"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No trend data available</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
