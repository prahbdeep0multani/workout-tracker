"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  return (
    <>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <Dumbbell className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">RepFlow</span>
      </div>

      <Card className="border-border/50">
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <Mail className="h-8 w-8 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription className="mt-2">
            We&apos;ve sent a verification link to your email address.
            Click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground space-y-2">
            <p>Didn&apos;t receive the email? Check your spam folder or make sure you entered the correct address.</p>
          </div>

          <Button asChild className="w-full">
            <Link href="/login">
              Continue to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Wrong email?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up again
            </Link>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
