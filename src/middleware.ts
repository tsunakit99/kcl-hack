import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: '/signin',
  }
})

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon|signup).*)',], }