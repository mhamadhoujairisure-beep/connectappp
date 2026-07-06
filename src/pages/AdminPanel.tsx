import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Users, Store, Package, BarChart3, Lock } from "lucide-react";

const mockMerchants = [
  { id: "m1", name: "Luxe Goods", status: "approved", subscription: true, email: "luxe@email.com" },
  { id: "m2", name: "TimeKeeper", status: "pending", subscription: false, email: "time@email.com" },
  { id: "m3", name: "Shade Co", status: "approved", subscription: true, email: "shade@email.com" },
  { id: "m4", name: "New Store", status: "pending", subscription: false, email: "new@email.com" },
];

const stats = [
  { icon: Users, label: "Users", value: "1,234" },
  { icon: Store, label: "Stores", value: "12" },
  { icon: Package, label: "Products", value: "89" },
  { icon: BarChart3, label: "Revenue", value: "$4,560" },
];

const AdminPanel = () => {
  const [adminAuth, setAdminAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"merchants" | "stats">("merchants");

  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter admin credentials</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: Implement proper admin auth
              setAdminAuth(true);
            }}
            className="space-y-4"
          >
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-card border-border text-foreground"
            />
            <Button type="submit" className="w-full bg-gradient-gold font-semibold">
              Enter
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-gradient-gold">Admin Panel</h1>
        <Button variant="ghost" size="sm" onClick={() => setAdminAuth(false)} className="text-muted-foreground">
          Logout
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <Icon className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4">
        {(["merchants", "stats"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {t === "merchants" ? "Merchants" : "Statistics"}
          </button>
        ))}
      </div>

      {/* Merchants list */}
      {tab === "merchants" && (
        <div className="p-4 space-y-3">
          {mockMerchants.map((merchant) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{merchant.name}</h3>
                  <p className="text-xs text-muted-foreground">{merchant.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        merchant.status === "approved"
                          ? "bg-primary/20 text-primary"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {merchant.status}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        merchant.subscription
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {merchant.subscription ? "Subscribed" : "No sub"}
                    </span>
                  </div>
                </div>
                {merchant.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="icon" className="h-8 w-8 bg-primary/20 hover:bg-primary/30 text-primary">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
