"use client";

/**
 * Client-side cart state for the on-site storefront.
 *
 * Talks only to our own `/api/shop/cart` proxy (never to WooCommerce directly).
 * The proxy returns an opaque session token after each call; we persist it in
 * localStorage so the cart survives reloads and addresses the same WooCommerce
 * cart across requests.
 *
 * Everything degrades gracefully: if the shop is unconfigured the provider stays
 * in an inert "not configured" state and add-to-cart is a no-op, so the rest of
 * the storefront still renders.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  StoreApiSession,
  StoreCart,
} from "@/lib/integrations/woocommerce/store-client";

const SESSION_STORAGE_KEY = "spark-shop-cart-session";

type CartApiResponse = {
  configured: boolean;
  cart?: StoreCart | null;
  session?: StoreApiSession;
  error?: string;
  code?: string;
};

type CartStatus = "idle" | "loading" | "ready" | "unconfigured";

type CartContextValue = {
  cart: StoreCart | null;
  status: CartStatus;
  /** Total quantity across all lines — for the header badge. */
  itemCount: number;
  /** In-flight mutation flag for disabling buttons. */
  busy: boolean;
  /** Last user-facing error from a cart action, if any. */
  error: string | null;
  addItem: (productId: number, quantity?: number) => Promise<boolean>;
  updateItem: (key: string, quantity: number) => Promise<boolean>;
  removeItem: (key: string) => Promise<boolean>;
  /** The persisted session, needed by the checkout flow. */
  session: StoreApiSession | null;
  clearError: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredSession(): StoreApiSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoreApiSession;
    if (parsed && (parsed.cartToken || parsed.nonce)) return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoreApiSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session && (session.cartToken || session.nonce)) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Private-mode / storage-disabled: cart simply won't persist across reloads.
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null);
  // Starts in "loading": the mount effect always fetches the cart immediately.
  const [status, setStatus] = useState<CartStatus>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Hold the session in a ref so action callbacks always send the latest token
  // without being re-created on every change.
  const sessionRef = useRef<StoreApiSession | null>(null);
  const [session, setSession] = useState<StoreApiSession | null>(null);

  const applySession = useCallback((next: StoreApiSession | undefined) => {
    if (!next) return;
    // Merge so a response that omits one token doesn't drop the other.
    const merged: StoreApiSession = {
      cartToken: next.cartToken ?? sessionRef.current?.cartToken,
      nonce: next.nonce ?? sessionRef.current?.nonce,
    };
    sessionRef.current = merged;
    setSession(merged);
    writeStoredSession(merged);
  }, []);

  // Hydrate the cart once on mount from any persisted session. State is set only
  // from the async resolution (never synchronously in the effect body) so the
  // server/client first render stays identical and React isn't re-entered.
  useEffect(() => {
    let cancelled = false;
    // Seed the ref synchronously so an immediate action sends the stored token;
    // the `session` STATE is populated by applySession once the fetch resolves.
    const stored = readStoredSession();
    sessionRef.current = stored;

    const query = new URLSearchParams();
    if (stored?.cartToken) query.set("token", stored.cartToken);
    if (stored?.nonce) query.set("nonce", stored.nonce);
    const qs = query.toString();

    fetch(`/api/shop/cart${qs ? `?${qs}` : ""}`)
      .then((res) => res.json() as Promise<CartApiResponse>)
      .then((data) => {
        if (cancelled) return;
        if (!data.configured) {
          setStatus("unconfigured");
          return;
        }
        if (data.cart) setCart(data.cart);
        applySession(data.session ?? stored ?? undefined);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        // Network failure on initial load — leave the cart empty but usable.
        if (stored) applySession(stored);
        setStatus("ready");
      });

    return () => {
      cancelled = true;
    };
  }, [applySession]);

  const runAction = useCallback(
    async (body: Record<string, unknown>): Promise<boolean> => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch("/api/shop/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, session: sessionRef.current }),
        });
        const data = (await res.json()) as CartApiResponse;

        if (!data.configured) {
          setStatus("unconfigured");
          return false;
        }
        if (!res.ok || data.error) {
          setError(data.error ?? "Something went wrong. Please try again.");
          return false;
        }
        if (data.cart) setCart(data.cart);
        applySession(data.session);
        setStatus("ready");
        return true;
      } catch {
        setError("Network error. Please try again.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [applySession]
  );

  const addItem = useCallback(
    (productId: number, quantity = 1) =>
      runAction({ action: "add", productId, quantity }),
    [runAction]
  );

  const updateItem = useCallback(
    (key: string, quantity: number) =>
      runAction({ action: "update", key, quantity }),
    [runAction]
  );

  const removeItem = useCallback(
    (key: string) => runAction({ action: "remove", key }),
    [runAction]
  );

  const clearError = useCallback(() => setError(null), []);

  const itemCount = useMemo(() => {
    if (!cart) return 0;
    // Prefer the server-computed count; fall back to summing line quantities.
    if (typeof cart.items_count === "number") return cart.items_count;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      status,
      itemCount,
      busy,
      error,
      addItem,
      updateItem,
      removeItem,
      session,
      clearError,
    }),
    [
      cart,
      status,
      itemCount,
      busy,
      error,
      addItem,
      updateItem,
      removeItem,
      session,
      clearError,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return ctx;
}
