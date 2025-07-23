
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Clock, Bell, Settings } from 'lucide-react';
import { formatTargetTime, parseTargetTime } from '@/utils/timeUtils';

interface TargetTimeSettingsProps {
  targetMinutes: number;
  onTargetChange: (minutes: number) => void;
  isTargetReached: boolean;
  onSnooze: (minutes: number) => void;
  isSnoozing: boolean;
  snoozeTimeLeft: number;
}

const TargetTimeSettings: React.FC<TargetTimeSettingsProps> = ({
  targetMinutes,
  onTargetChange,
  isTargetReached,
  onSnooze,
  isSnoozing,
  snoozeTimeLeft
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(formatTargetTime(targetMinutes));
  const [customSnooze, setCustomSnooze] = useState('');

  const handleSaveTarget = () => {
    const newTargetMinutes = parseTargetTime(tempTarget);
    onTargetChange(newTargetMinutes);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempTarget(formatTargetTime(targetMinutes));
    setIsEditing(false);
  };

  const handleSnooze = (minutes: number) => {
    onSnooze(minutes);
  };

  const handleCustomSnooze = () => {
    const minutes = parseInt(customSnooze);
    if (minutes > 0) {
      onSnooze(minutes);
      setCustomSnooze('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Target Working Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="target-time">Daily Target:</Label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                id="target-time"
                type="time"
                value={tempTarget}
                onChange={(e) => setTempTarget(e.target.value)}
                className="w-32"
              />
              <Button onClick={handleSaveTarget} size="sm">
                Save
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-primary">
                {formatTargetTime(targetMinutes)}
              </span>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {isTargetReached && (
          <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <Bell className="h-5 w-5" />
              <span className="font-medium">🎉 Target reached!</span>
            </div>
            
            {isSnoozing ? (
              <div className="text-center">
                <div className="text-sm text-green-600 mb-2">
                  Snoozing... Time left: {Math.ceil(snoozeTimeLeft / 60)} minutes
                </div>
                <div className="text-xs text-muted-foreground">
                  You can still stop the current lap anytime
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-green-700 mb-2">
                  Great job! Would you like to take a break?
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleSnooze(15)}
                    size="sm"
                    variant="outline"
                  >
                    15 min
                  </Button>
                  <Button
                    onClick={() => handleSnooze(30)}
                    size="sm"
                    variant="outline"
                  >
                    30 min
                  </Button>
                  <Button
                    onClick={() => handleSnooze(60)}
                    size="sm"
                    variant="outline"
                  >
                    1 hour
                  </Button>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      placeholder="Custom"
                      value={customSnooze}
                      onChange={(e) => setCustomSnooze(e.target.value)}
                      className="w-20 h-8"
                      min="1"
                    />
                    <Button
                      onClick={handleCustomSnooze}
                      size="sm"
                      variant="outline"
                      disabled={!customSnooze || parseInt(customSnooze) <= 0}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TargetTimeSettings;
