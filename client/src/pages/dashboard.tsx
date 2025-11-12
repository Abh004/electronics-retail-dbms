import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: string;
}

export default function Dashboard() {
  const [customerId, setCustomerId] = useState("");
  const [customerSpent, setCustomerSpent] = useState<string | null>(null);
  const [searchedId, setSearchedId] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const handleLookupSpending = async () => {
    if (!customerId) return;
    setSearchedId(customerId);
    
    try {
      const response = await fetch(`/api/functions/customer-spent/${customerId}`);
      const data = await response.json();
      setCustomerSpent(data.totalSpent);
    } catch (error) {
      console.error("Error fetching customer spending:", error);
      setCustomerSpent(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your electronics retail business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {stats?.totalProducts || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
              </CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {stats?.totalCustomers || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {stats?.totalOrders || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  ${stats?.totalRevenue || "0.00"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Customer Spending Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="customerId" className="text-sm font-medium mb-2 block">
                    Customer ID
                  </Label>
                  <Input
                    id="customerId"
                    data-testid="input-customer-id"
                    type="number"
                    placeholder="Enter customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button
                  data-testid="button-lookup-spending"
                  onClick={handleLookupSpending}
                  disabled={!customerId}
                  className="h-11"
                >
                  Lookup Spending
                </Button>
              </div>

              {searchedId && customerSpent !== null && (
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">
                      Customer #{searchedId} Total Spent
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      ${customerSpent}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
