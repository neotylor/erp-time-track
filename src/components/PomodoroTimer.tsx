import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Clock, Coffee, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'work' | 'break' | 'longBreak';

const PomodoroTimer = () => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [currentMode, setCurrentMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Update timeLeft when work/break times change and timer isn't running
  useEffect(() => {
    if (!isRunning) {
      const time = currentMode === 'work' ? workTime : 
                   currentMode === 'break' ? breakTime : longBreakTime;
      setTimeLeft(time * 60);
    }
  }, [workTime, breakTime, longBreakTime, currentMode, isRunning]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (currentMode === 'work') {
      setSessions(prev => prev + 1);
      setTotalFocusTime(prev => prev + workTime);
      
      // Every 4 work sessions, take a long break
      if ((sessions + 1) % 4 === 0) {
        setCurrentMode('longBreak');
        setTimeLeft(longBreakTime * 60);
        toast({
          title: "Great work! 🎉",
          description: "Time for a long break. You've earned it!",
        });
      } else {
        setCurrentMode('break');
        setTimeLeft(breakTime * 60);
        toast({
          title: "Work session complete! ✅",
          description: "Time for a short break.",
        });
      }
    } else {
      setCurrentMode('work');
      setTimeLeft(workTime * 60);
      toast({
        title: "Break time over! 💪",
        description: "Ready for another focused work session?",
      });
    }

    // Play notification sound (you could add an actual audio file)
    if ('Notification' in window) {
      new Notification(
        currentMode === 'work' ? 'Work session complete!' : 'Break time over!',
        {
          body: currentMode === 'work' ? 'Time for a break' : 'Ready to focus?',
          icon: '/favicon.ico'
        }
      );
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const time = currentMode === 'work' ? workTime : 
                 currentMode === 'break' ? breakTime : longBreakTime;
    setTimeLeft(time * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = currentMode === 'work' ? workTime * 60 : 
                      currentMode === 'break' ? breakTime * 60 : longBreakTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getModeIcon = () => {
    switch (currentMode) {
      case 'work': return <Target className="h-5 w-5" />;
      case 'break': return <Coffee className="h-5 w-5" />;
      case 'longBreak': return <Coffee className="h-5 w-5" />;
    }
  };

  const getModeColor = () => {
    switch (currentMode) {
      case 'work': return 'text-red-500';
      case 'break': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
        <Clock className="h-8 w-8 text-primary" />
      </div>

      {/* Timer Display */}
      <Card className="text-center">
        <CardContent className="p-8">
          <div className={`flex items-center justify-center gap-2 mb-4 ${getModeColor()}`}>
            {getModeIcon()}
            <span className="text-lg font-medium capitalize">
              {currentMode === 'longBreak' ? 'Long Break' : currentMode}
            </span>
          </div>
          
          <div className="text-6xl font-bold mb-6 font-mono">
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={toggleTimer}
              size="lg"
              variant={isRunning ? "secondary" : "default"}
              className="gap-2"
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Timer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="work-time">Work Time (minutes)</Label>
              <Input
                id="work-time"
                type="number"
                min="1"
                max="60"
                value={workTime}
                onChange={(e) => setWorkTime(parseInt(e.target.value) || 25)}
                disabled={isRunning}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="break-time">Short Break (minutes)</Label>
              <Input
                id="break-time"
                type="number"
                min="1"
                max="30"
                value={breakTime}
                onChange={(e) => setBreakTime(parseInt(e.target.value) || 5)}
                disabled={isRunning}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="long-break-time">Long Break (minutes)</Label>
              <Input
                id="long-break-time"
                type="number"
                min="1"
                max="60"
                value={longBreakTime}
                onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                disabled={isRunning}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{sessions}</div>
              <div className="text-sm text-muted-foreground">Sessions Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{totalFocusTime}</div>
              <div className="text-sm text-muted-foreground">Minutes Focused</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;