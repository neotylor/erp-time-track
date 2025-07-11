
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Palette, Bell, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState(true);

  return (
    <div className="min-h-screen bg-background p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <SettingsIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Customize your timesheet calculator experience
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Bell className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable notifications</Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
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
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export and manage your timesheet data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Export Data as CSV
              </Button>
              <Button variant="outline" className="w-full">
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
