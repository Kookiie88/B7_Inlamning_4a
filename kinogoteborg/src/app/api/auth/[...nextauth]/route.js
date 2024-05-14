import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDb from "@/lib/connectToDb";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectToDb();
          const user = await User.findOne({ "attributes.email": email });

          if (!user) {
            return null;
          }

          const passWordmatch = await bcrypt.compare(password, user.attributes.password);

          if (!passWordmatch) {
            return null;
          }
          return user.attributes;
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        //pass user id and number to token
        return {
          ...token,
          phoneNumber: user.phoneNumber,
          bookings: user.bookings,
          reviews: user.reviews,
        };
      }
      return token;
    },
    async session({ token, user, session }) {
      //Pass user id and number to session
      return {
        ...session,
        user: {
          ...session.user,
          phoneNumber: token.phoneNumber,
          bookings: token.bookings,
          reviews: token.reviews,
        },
      };
    },
  },
  secret: process.env.NEXTEAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
