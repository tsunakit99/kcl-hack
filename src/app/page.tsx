"use client";

import Skeleton from '@mui/material/Skeleton';
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  // if (session) {
  //   return (
  //     <>
  //       <p>Signed in as {session.user?.email}</p>
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // } else {
  //   return (
  //     <>
  //       <p>Not signed in</p>
  //       <button onClick={() => signIn("github")}>Sign in with GitHub</button>
  //     </>
  //   );
  // }

  return (
    <>
      <div>
        <h1>Next Auth</h1>
        <div>
          <div>ログイン中のユーザ</div>
          {status === "loading" ? (
            <Skeleton variant="text" animation="wave" width={175} height={25} />  
          ) : (
            <p> {session?.user?.email}</p>
          )}
        </div>
        <button onClick={() => signOut()}>サインアウト</button>
      </div>
    </>
  );
}
