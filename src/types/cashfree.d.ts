declare module "@cashfreepayments/cashfree-js" {
  type CashfreeMode = "sandbox" | "production";

  interface CashfreeCheckoutOptions {
    paymentSessionId: string;
  }

  interface CashfreeInstance {
    checkout(
      options: CashfreeCheckoutOptions
    ): Promise<void>;
  }

  interface LoadOptions {
    mode: CashfreeMode;
  }

  export function load(
    options: LoadOptions
  ): Promise<CashfreeInstance | null>;
}