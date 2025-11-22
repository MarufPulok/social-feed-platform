import { comparePassword } from "@/lib/auth";
import connectDB from "@/lib/db";
import { SigninValidation } from "@/lib/validators/auth.validator";
import User, { IUser } from "@/schemas/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User as NextAuthUser } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Validate input
        const validationResult = SigninValidation.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!validationResult.success) {
          throw new Error("Invalid email or password format");
        }

        // Connect to database
        await connectDB();

        // Find user
        const user = (await User.findOne({
          email: credentials.email,
        })) as IUser | null;
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const password =
          typeof credentials.password === "string" ? credentials.password : "";
        const userPassword =
          typeof user.password === "string" ? user.password : "";
        const isPasswordValid = await comparePassword(password, userPassword);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return user object (will be available in session)
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: NextAuthUser;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
