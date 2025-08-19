
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Palette, Bell, Download, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';
import AuthForm from '@/components/AuthForm';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut, isAuthenticated, loading } = useAuth();
  const { permission, isSupported, requestPermission } = useNotifications();
  const [autoSave, setAutoSave] = React.useState(true);

  const isDarkMode = theme === 'dark';

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Browser notifications are not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    if (checked) {
      const granted = await requestPermission();
      if (granted) {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive browser notifications for all tools."
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings to receive alerts.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Notifications Disabled",
        description: "To completely disable notifications, please use your browser settings."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-24 md:pb-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <SettingsIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Customize your Tools Hub Pro experience
          </p>
        </div>

        <div className="grid gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <User className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Account</CardTitle>
              <CardDescription>
                {isAuthenticated 
                  ? "Manage your account and sync settings"
                  : "Sign in to sync your data across devices"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Data synced across devices
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> You can use all features without signing in. 
                      Your data will be stored locally on this device only. 
                      Sign in to sync your data across multiple devices.
                    </p>
                  </div>
                  <AuthForm />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="browser-notifications">Browser notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified for timer events, target completions, and more
                    </p>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={permission === 'granted'}
                    onCheckedChange={handleNotificationToggle}
                    disabled={!isSupported}
                  />
                </div>
                {!isSupported && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Browser notifications are not supported in this browser
                  </p>
                )}
                {permission === 'denied' && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Notifications are blocked. Please enable them in your browser settings.
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto-save data</Label>
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export and manage your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Export Data as CSV
              </Button>
              <Button variant="outline" className="w-full">
                Clear All Local Data
              </Button>
              {isAuthenticated && (
                <Button variant="outline" className="w-full">
                  Sync All Data Now
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
