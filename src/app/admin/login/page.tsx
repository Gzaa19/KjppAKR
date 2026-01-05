import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4 relative overflow-hidden">


            <Card className="w-full max-w-md border-none shadow-2xl bg-card z-10 transition-all duration-300 hover:shadow-primary/5">
                <CardHeader className="space-y-1 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        Admin Portal
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credentials to access the workspace
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@company.com"
                                className="pl-9 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <a
                                href="#"
                                className="text-xs text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full text-md font-medium h-11 transition-all duration-200 hover:scale-[1.02] bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign In
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Don't have an account?{" "}
                        <a
                            href="#"
                            className="text-primary font-medium hover:underline transition-all"
                        >
                            Contact support
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
