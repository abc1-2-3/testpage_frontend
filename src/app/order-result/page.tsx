import { Suspense } from 'react';
import OrderResult from './OrderResult';

export const metadata = {
  title: '付款結果 — 魔法書房',
};

export default function OrderResultPage() {
  return (
    <Suspense fallback={null}>
      <OrderResult />
    </Suspense>
  );
}
