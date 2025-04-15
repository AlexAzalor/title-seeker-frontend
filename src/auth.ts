import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { backendURL } from "./lib/constants";
import { getUsers } from "./orval_api/users/users";

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import "next-auth/jwt";

export interface UserExtended {
  /** User role */
  role: string;
  /** User uuid */
  uuid: string;
  new_movies_to_add_count: number;
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends UserExtended {
    /** OpenID ID Token */
    idToken?: string;
  }
}

// https://authjs.dev/getting-started/typescript
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"] &
      UserExtended;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email_verified) {
        return true;
      }

      return false;
    },
    async jwt({ token, profile }) {
      if (!profile) {
        return token;
      }

      const { email, given_name, family_name } = profile;
      if (!email || !given_name || !family_name) {
        return token;
      }

      const { aPIGoogleAuth } = getUsers();
      try {
        const { data } = await aPIGoogleAuth(
          {
            email: email,
            given_name: given_name,
            family_name: family_name,
          },
          backendURL,
        );

        token.role = data.role;
        token.uuid = data.uuid;
        token.new_movies_to_add_count = data.new_movies_to_add_count;

        // return token;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return null;
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom data to session object
      if (session.user) {
        session.user.role = token.role;
        session.user.uuid = token.uuid;
        session.user.new_movies_to_add_count = token.new_movies_to_add_count;
      }

      return session;
    },
  },
});
