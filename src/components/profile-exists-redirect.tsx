"use client";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export function ProfileExistsRedirect() {
  useEffect(() => {
    // Redirect immediately after a brief moment to show the message
    const timer = setTimeout(() => {
      window.location.href = "/preview";
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleManualRedirect = () => {
    window.location.href = "/preview";
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <Card className="p-5 relative">
        <div className="text-center">
          <Icon
            icon="mdi:check-circle"
            className="h-12 w-12 mx-auto mb-4 text-green-500"
          />
          <h2 className="text-xl font-semibold mb-2">Profile Already Exists</h2>
          <p className="text-muted-foreground mb-4">
            You already have a profile. Redirecting to your profile preview...
          </p>
          <Icon
            icon="line-md:loading-loop"
            className="h-6 w-6 mx-auto animate-spin text-primary mb-4"
          />
          <Button
            onClick={handleManualRedirect}
            variant="outline"
            className="mt-2"
          >
            Go to Profile Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
