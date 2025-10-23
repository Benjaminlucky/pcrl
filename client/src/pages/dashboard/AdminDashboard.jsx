import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Realtors", value: 128 },
    { label: "Total Recruits", value: 642 },
    { label: "Active Campaigns", value: 12 },
  ];

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-3xl font-bold text-gray-800">Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-lg border border-gray-100 rounded-2xl">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-extrabold text-[#561010]">
                  {s.value}
                </p>
                <p className="text-gray-600 mt-2">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
