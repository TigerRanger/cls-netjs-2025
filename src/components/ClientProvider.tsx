 "use client";

import { Provider } from "react-redux";
 import { SessionProvider } from "next-auth/react";
 import { PersistGate } from 'redux-persist/integration/react';
 import { store, persistor } from '@/redux/store';
 import { Session } from "next-auth"; // Import correct type

// import Loading from "@/app/loading";

export default function ClientProvider({
   children,
   session,
}: {
   children: React.ReactNode;
   session?: Session | null;// Use appropriate typing if available
}) {
  return (
     <SessionProvider session={session}>
       <PersistGate persistor={persistor}>
       <Provider store={store}>{children}</Provider>
       </PersistGate>
    </SessionProvider>
  );
}


