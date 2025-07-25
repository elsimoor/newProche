
import { NextResponse } from "next/server";
import { getSession } from "@/app/actions";

export async function POST(request: Request) {
  console.log("Login route");

  try {
    // Parse the incoming JSON payload
    const { email, password } = await request.json();
    const session = await getSession();

    // Send the GraphQL mutation to your backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/procheDeMoi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              token
              user {
                id
                
                firstName
                lastName
                businessType
                email
                role
                businessType
       
            
              }
            }
          }
        `,
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      }),
    });

    // Parse the response from your backend
    const result = await backendResponse.json();

    console.log('result', result)

    // If login is successful, store session data
    if (result?.data?.login?.token) {
      const token = result.data.login.token;
      // Create a new NextResponse to attach session cookies
      const response = NextResponse.json(result, { status: 200 });

      // Get the session using iron-session/next
      // const session = await getIronSession(
      //   request,
      //   response,
      //   sessionOptions
      // );

      session.isLoggedIn = true;
      session.token = token;
      session.user = result.data.login.user;

 

      await session.save();
      // session.user = {
      //   token,
      //   ...result.data.login.user,
      // };
      // await session.save();

      return response;
    }

    // If login fails, return an error response
    return NextResponse.json({ error: result?.errors[0]?.message }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}