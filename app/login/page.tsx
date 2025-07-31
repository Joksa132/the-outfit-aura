import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Login or Create Account | The Outfit Aura";
  const description =
    "Log in to your existing account or create a new one to start shopping and manage your orders at The Outfit Aura.";
  const keywords =
    "login, sign in, create account, register, new account, e-commerce, the outfit aura, online shop";

  return {
    title: title,
    description: description,
    keywords: keywords,
  };
}

export default async function LoginPage() {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Create a new account to start shopping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <form
              action={async () => {
                "use server";

                await signIn("google", { redirectTo: "/" });
              }}
            >
              <Button className="w-full" variant="outline" type="submit">
                <Mail className="h-4 w-4" />
                Continue with Google
              </Button>
            </form>

            <form
              action={async () => {
                "use server";

                await signIn("github", { redirectTo: "/" });
              }}
            >
              <Button className="w-full" variant="outline" type="submit">
                <Github className="h-4 w-4" />
                Continue with GitHub
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
