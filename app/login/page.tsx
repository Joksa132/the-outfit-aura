import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Github, Mail } from "lucide-react";

export default function LoginPage() {
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
            <Button variant="outline">
              <Mail className="h-4 w-4" />
              Continue with Google
            </Button>
            <Button variant="outline">
              <Github className="h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
