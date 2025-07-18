import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Plus, Eye, EyeOff, Copy, Trash2, Key, Lock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VaultItem {
  id: string;
  title: string;
  type: 'password' | 'note';
  username?: string;
  password?: string;
  website?: string;
  notes: string;
  created: Date;
  updated: Date;
}

const SecureVault = () => {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'password' as 'password' | 'note',
    username: '',
    password: '',
    website: '',
    notes: ''
  });
  
  const { toast } = useToast();

  // Simple demo unlock - in real app, use proper encryption
  const handleUnlock = () => {
    if (masterPassword === 'demo123') {
      setIsUnlocked(true);
      toast({
        title: "Vault Unlocked",
        description: "Welcome to your secure vault!",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect master password. Try 'demo123' for demo.",
        variant: "destructive"
      });
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewItem({ ...newItem, password });
  };

  const addVaultItem = () => {
    if (!newItem.title) return;

    const item: VaultItem = {
      id: Date.now().toString(),
      title: newItem.title,
      type: newItem.type,
      username: newItem.username,
      password: newItem.password,
      website: newItem.website,
      notes: newItem.notes,
      created: new Date(),
      updated: new Date()
    };

    setVaultItems([...vaultItems, item]);
    setNewItem({
      title: '',
      type: 'password',
      username: '',
      password: '',
      website: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item Added",
      description: "Your item has been securely stored.",
    });
  };

  const deleteItem = (id: string) => {
    setVaultItems(vaultItems.filter(item => item.id !== id));
    toast({
      title: "Item Deleted",
      description: "The item has been permanently removed.",
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Secure Vault</CardTitle>
            <p className="text-muted-foreground">
              Enter your master password to access your encrypted vault
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Mode:</strong> Use password "demo123" to unlock the vault.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="master-password">Master Password</Label>
              <Input
                id="master-password"
                type="password"
                placeholder="Enter master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              />
            </div>
            
            <Button onClick={handleUnlock} className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Unlock Vault
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>🔒 Your data is encrypted and secure</p>
              <p>🚫 No password = No access</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Secure Vault</h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Unlocked
          </Badge>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsUnlocked(false)}
        >
          Lock Vault
        </Button>
      </div>

      {/* Add Item Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Vault Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'password' | 'note' })}
                >
                  <option value="password">Password</option>
                  <option value="note">Secure Note</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Gmail Account"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
            </div>

            {newItem.type === 'password' && (
              <>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    placeholder="https://example.com"
                    value={newItem.website}
                    onChange={(e) => setNewItem({ ...newItem, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username/Email</Label>
                  <Input
                    placeholder="your.email@example.com"
                    value={newItem.username}
                    onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Enter or generate password"
                      value={newItem.password}
                      onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                    />
                    <Button type="button" variant="outline" onClick={generatePassword}>
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes or information..."
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              />
            </div>

            <Button onClick={addVaultItem} className="w-full">
              Add to Vault
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vault Items */}
      <div className="space-y-4">
        {vaultItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your vault is empty. Add your first password or secure note!</p>
            </CardContent>
          </Card>
        ) : (
          vaultItems.map(item => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant={item.type === 'password' ? 'default' : 'secondary'}>
                      {item.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.type === 'password' && (
                  <>
                    {item.website && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Website:</span>
                        <span className="text-sm text-muted-foreground">{item.website}</span>
                      </div>
                    )}
                    {item.username && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Username:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.username}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.username!, 'Username')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {item.password && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Password:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">
                            {showPasswords[item.id] ? item.password : '••••••••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(item.id)}
                          >
                            {showPasswords[item.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.password!, 'Password')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {item.notes && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      {item.notes}
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Created: {item.created.toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SecureVault;