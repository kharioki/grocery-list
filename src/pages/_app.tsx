import '@/styles/globals.css'
import '@fontsource/poppins'
import type { AppType } from 'next/app';
import type { ServerRouter } from '@/server/router'
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';

function getBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : `http://localhost:3000/api/trpc`
  }
  return '/api/trpc'
}

const { withTRPC } = createTRPCNext<ServerRouter>({
  config({ ctx }) {
    const links = [
      httpBatchLink({
        url: getBaseUrl(),
      }),
    ];
    return { links };
  },
  ssr: true,
});

const App: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default withTRPC(App);
