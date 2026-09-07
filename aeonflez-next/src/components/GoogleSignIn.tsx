"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, firebaseConfigError } from "../lib/firebase";

const provider = new GoogleAuthProvider();

export default function GoogleSignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => (auth ? onAuthStateChanged(auth, setUser) : undefined), []);

  async function handleSignIn() {
    setError(null);
    setIsSigningIn(true);

    try {
      if (!auth) {
        return;
      }
      await signInWithPopup(auth, provider);
    } catch (signInError) {
      const code = signInError instanceof Error ? signInError.message : "";
      if (code.includes("popup-closed-by-user")) {
        setError("The Google sign-in window was closed before sign-in completed.");
      } else if (code.includes("unauthorized-domain")) {
        setError("This site is not authorized in Firebase. Add its domain in Firebase Authentication settings.");
      } else {
        setError("We could not complete Google sign-in. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  }

  if (firebaseConfigError) {
    return (
      <p role="alert">
        Google sign-in is not configured yet. Set the Firebase variables in
        <code> .env.local</code> and enable Google in Firebase Authentication.
      </p>
    );
  }

  if (user) {
    return (
      <section aria-live="polite">
        <p>Signed in as {user.email ?? user.displayName ?? "your Google account"}.</p>
        <button type="button" onClick={() => auth && signOut(auth)}>
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section>
      <button type="button" onClick={handleSignIn} disabled={isSigningIn}>
        {isSigningIn ? "Opening Google sign-in..." : "Continue with Google"}
      </button>
      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}
    </section>
  );
}
