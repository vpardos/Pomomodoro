"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo } from "lucide-react";

export function TaskPlaceholder() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <div className="mx-auto size-16 rounded-full bg-muted flex items-center justify-center">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">
              Task management coming soon
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              is coming i swear.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
