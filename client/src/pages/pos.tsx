import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
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
import { ShoppingCart, Plus, Minus, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Customer, Product } from "@shared/schema";

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
}

interface ProductWithBrand extends Product {
  brandName?: string;
}

export default function POS() {
  const [, setLocation] = useLocation();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: products = [] } = useQuery<ProductWithBrand[]>({
    queryKey: ["/api/products"],
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: { customerId: number; cartItems: { productId: number; quantity: number }[] }) =>
      apiRequest("POST", "/api/orders", data),
    onSuccess: (data: { orderId: number }) => {
      toast({
        title: "Success",
        description: "Order created successfully",
      });
      setCart([]);
      setSelectedCustomerId("");
      setLocation(`/orders/${data.orderId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: ProductWithBrand) => {
    const existingItem = cart.find((item) => item.productId === product.productId);
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  };

  const handleCreateOrder = () => {
    if (!selectedCustomerId) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      customerId: parseInt(selectedCustomerId),
      cartItems: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create new orders and manage transactions
          </p>
        </div>

        <div className="mb-6">
          <Label htmlFor="customer" className="text-sm font-medium mb-2 block">
            Select Customer <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
            <SelectTrigger data-testid="select-customer" className="h-11">
              <SelectValue placeholder="Choose a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem
                  key={customer.customerId}
                  value={customer.customerId.toString()}
                >
                  {customer.firstName} {customer.lastName} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Products</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    data-testid="input-search-products"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No products found
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.productId}
                        className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                        data-testid={`product-item-${product.productId}`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {product.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.brandName} • ${Number(product.price).toFixed(2)} • Stock: {product.stock}
                          </div>
                        </div>
                        <Button
                          data-testid={`button-add-to-cart-${product.productId}`}
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                      {cart.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-3 p-3 rounded-lg border"
                          data-testid={`cart-item-${item.productId}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {item.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${Number(item.price).toFixed(2)} each
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              data-testid={`button-decrease-${item.productId}`}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium" data-testid={`quantity-${item.productId}`}>
                              {item.quantity}
                            </span>
                            <Button
                              data-testid={`button-increase-${item.productId}`}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              data-testid={`button-remove-${item.productId}`}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span data-testid="text-cart-total">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      data-testid="button-create-order"
                      className="w-full mt-4 h-12 text-base"
                      onClick={handleCreateOrder}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? "Creating Order..." : "Create Order"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
