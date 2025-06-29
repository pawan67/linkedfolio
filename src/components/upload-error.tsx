"use client";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export function UploadError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <Card className="p-5 relative">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="h-12 w-12 mx-auto mb-4 text-red-500"
          />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading the upload page. Please try refreshing.
          </p>
          <Button onClick={handleRefresh} className="px-4 py-2">
            Refresh Page
          </Button>
        </div>
      </Card>
    </div>
  );
}
