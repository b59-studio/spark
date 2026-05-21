import { describe, expect, it } from "vitest";
import { mapWooCommerceOrderPayload } from "@/lib/analytics/record-commerce-order";

describe("mapWooCommerceOrderPayload", () => {
  it("maps order id, total, line items, customer id, and payment method", () => {
    const mapped = mapWooCommerceOrderPayload({
      id: 42,
      status: "processing",
      currency: "USD",
      total: "25.50",
      date_created: "2026-05-01T12:00:00",
      customer_id: 7,
      payment_method: "stripe",
      billing: { email: "Organizer@Example.com" },
      line_items: [
        { product_id: 9, name: "Clipboard", quantity: 2, total: "25.50" },
      ],
    });

    expect(mapped.woocommerceOrderId).toBe(42);
    expect(mapped.totalCents).toBe(2550);
    expect(mapped.customerEmail).toBe("Organizer@Example.com");
    expect(mapped.woocommerceCustomerId).toBe(7);
    expect(mapped.paymentMethod).toBe("stripe");
    expect(mapped.lineItems).toHaveLength(1);
    expect(mapped.lineItems[0]?.name).toBe("Clipboard");
  });
});
