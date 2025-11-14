import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { customers } from '@/lib/data';

export function RecentSales() {
  const recentCustomers = customers.slice(0, 5);

  return (
    <div className="space-y-8">
      {recentCustomers.map((customer, index) => (
        <div className="flex items-center" key={customer.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={customer.avatarUrl} alt="Avatar" data-ai-hint="person face" />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +${(1999.00 / (index + 1)).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
