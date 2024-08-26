import NewCustomersChart from "@/components/NewCustomerChart";
import MonthlyGrowthChart from "@/components/SalesGrowthChart";
import TotalSalesChart from "@/components/SalesChart";
import CohortLifetimeValueChart from "@/components/CohortLifetimeValueChart";
import GeographicalChart from "@/components/GeographicalChart";

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-black-100 overflow-auto">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">RQ_Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <TotalSalesChart />
          </div>
          <div className="col-span-1">
            <MonthlyGrowthChart />
          </div>
          <div className="col-span-1">
            <NewCustomersChart />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <CohortLifetimeValueChart />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <GeographicalChart />
          </div>
        </div>
      </div>
    </div>
  );
}
