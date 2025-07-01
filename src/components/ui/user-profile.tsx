"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, User as UserIcon, Shield } from "lucide-react";

export function UserProfile() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <UserIcon className="mx-auto h-12 w-12 mb-4" />
            <p>No user logged in</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{user.email}</span>
            {user.email_confirmed_at && (
              <Badge variant="secondary" className="text-xs">Verified</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4 text-gray-500" />
            <span>Role: {user.role || 'User'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span>
              Joined {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <span>ID: {user.id.slice(0, 8)}...</span>
          </div>
        </div>

        {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Additional Information</h4>
            <div className="text-xs text-gray-600 space-y-1">
              {Object.entries(user.user_metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace('_', ' ')}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={signOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
