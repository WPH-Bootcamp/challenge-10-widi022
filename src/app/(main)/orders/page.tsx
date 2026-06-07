import AccountSidebar from "@/components/shared/AccountSidebar";
import OrderHistory from "@/features/order/OrderHistory";

export default function OrdersPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[210px_1fr]">
        <AccountSidebar />
        <OrderHistory />
      </div>
    </main>
  );
}
