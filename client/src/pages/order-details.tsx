import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { InsertPayment } from "@shared/schema";

interface OrderDetailData {
  orderId: number;
  orderDate: string;
  totalAmount: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderDetails: Array<{
    orderDetailId: number;
    productId: number;
    productName: string;
    quantity: number;
    pricePerUnit: string;
  }>;
  payments: Array<{
    transactionId: number;
    amount: string;
    paymentMode: string;
    status: string;
    paymentTimestamp: string;
  }>;
}

export default function OrderDetails() {
  const [, params] = useRoute("/orders/:id");
  const orderId = params?.id;
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("completed");
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery<OrderDetailData>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: balanceData } = useQuery<{ balance: string }>({
    queryKey: ["/api/functions/order-balance", orderId],
    enabled: !!orderId,
  });

  const addPaymentMutation = useMutation({
    mutationFn: (data: InsertPayment) =>
      apiRequest("POST", `/api/orders/${orderId}/payments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      queryClient.invalidateQueries({ queryKey: ["/api/functions/order-balance", orderId] });
      setPaymentAmount("");
      toast({
        title: "Success",
        description: "Payment added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment",
        variant: "destructive",
      });
    },
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }

    addPaymentMutation.mutate({
      orderId: parseInt(orderId!),
      amount: paymentAmount,
      paymentMode,
      status: paymentStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 md:py-12">
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded" />
            <div className="h-48 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 md:py-12">
          <div className="text-center py-12">
            <p className="text-lg font-medium text-foreground mb-1">
              Order not found
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              The order you're looking for doesn't exist
            </p>
            <Link href="/pos">
              <Button>Back to POS</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPaid = order.payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
  const balance = balanceData?.balance || "0.00";

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <Link href="/pos">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to POS
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Order #{order.orderId}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {new Date(order.orderDate).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium text-foreground">{order.customerName}</div>
              <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ${Number(order.totalAmount).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${
                  Number(balance) > 0 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
                }`}
                data-testid="text-balance"
              >
                ${Number(balance).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Quantity</TableHead>
                  <TableHead className="font-semibold">Price Per Unit</TableHead>
                  <TableHead className="font-semibold text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderDetails.map((detail) => (
                  <TableRow key={detail.orderDetailId}>
                    <TableCell className="font-medium">{detail.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{detail.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">
                      ${Number(detail.pricePerUnit).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${(Number(detail.pricePerUnit) * detail.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {order.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No payments recorded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {order.payments.map((payment) => (
                    <div
                      key={payment.transactionId}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          ${Number(payment.amount).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.paymentMode} • {new Date(payment.paymentTimestamp).toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          payment.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total Paid</span>
                      <span data-testid="text-total-paid">${totalPaid.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Add Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                    Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="amount"
                    data-testid="input-payment-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMode" className="text-sm font-medium mb-2 block">
                    Payment Mode
                  </Label>
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger data-testid="select-payment-mode" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                    Status
                  </Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger data-testid="select-payment-status" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  data-testid="button-add-payment"
                  type="submit"
                  className="w-full h-11"
                  disabled={addPaymentMutation.isPending}
                >
                  {addPaymentMutation.isPending ? "Processing..." : "Add Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
