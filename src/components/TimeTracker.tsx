
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Clock, Calendar, Coffee, Timer } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { minutesToTimeString, formatDifferenceTime, secondsToHHMMSS, formatTargetTime } from '@/utils/timeUtils';
import TargetTimeSettings from './TargetTimeSettings';

interface TimeLap {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
}

interface SessionData {
  date: string;
  laps: TimeLap[];
  totalMinutes: number;
  breakCount: number;
  breakDurationMinutes: number;
  targetMinutes: number;
}

const TimeTracker = () => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetMinutes, setTargetMinutes] = useState(480); // 8 hours default
  const [isTargetReached, setIsTargetReached] = useState(false);
  const [isSnoozing, setIsSnoozing] = useState(false);
  const [snoozeEndTime, setSnoozeEndTime] = useState<Date | null>(null);
  const [snoozeTimeLeft, setSnoozeTimeLeft] = useState(0);
  const [todaySession, setTodaySession] = useState<SessionData>({
    date: new Date().toDateString(),
    laps: [],
    totalMinutes: 0,
    breakCount: 0,
    breakDurationMinutes: 0,
    targetMinutes: 480
  });
  const [previousSessions, setPreviousSessions] = useState<SessionData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadTodaySession();
    loadPreviousSessions();
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user]);

  // Check target and snooze status
  useEffect(() => {
    const totalMinutes = todaySession.totalMinutes + getCurrentDuration();
    
    if (totalMinutes >= targetMinutes && !isTargetReached) {
      setIsTargetReached(true);
      toast({
        title: "🎉 Target Reached!",
        description: "You've reached your target working time for today!"
      });
    }

    // Handle snooze countdown
    if (isSnoozing && snoozeEndTime) {
      const timeLeft = snoozeEndTime.getTime() - currentTime.getTime();
      if (timeLeft <= 0) {
        setIsSnoozing(false);
        setSnoozeEndTime(null);
        setSnoozeTimeLeft(0);
        toast({
          title: "Snooze Ended",
          description: "Time to get back to work! 💪"
        });
      } else {
        setSnoozeTimeLeft(timeLeft);
      }
    }
  }, [currentTime, todaySession.totalMinutes, targetMinutes, isTargetReached, isSnoozing, snoozeEndTime]);

  const loadTodaySession = async () => {
    const today = new Date().toDateString();
    
    if (user) {
      // Load from database
      const { data, error } = await supabase
        .from('time_tracking_sessions')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (error) {
        console.error('Error loading session:', error);
        return;
      }

      if (data) {
        const parsedLaps = Array.isArray(data.laps) ? data.laps.map((lap: any) => ({
          id: lap.id,
          startTime: new Date(lap.startTime),
          endTime: new Date(lap.endTime),
          duration: lap.duration
        })) : [];

        const sessionData = {
          date: today,
          laps: parsedLaps,
          totalMinutes: data.total_minutes || 0,
          breakCount: data.break_count || 0,
          breakDurationMinutes: data.break_duration_minutes || 0,
          targetMinutes: data.target_minutes || 480
        };

        setTodaySession(sessionData);
        setTargetMinutes(sessionData.targetMinutes);
      }
    } else {
      // Load from localStorage
      const stored = localStorage.getItem(`timeTracker_${today}`);
      if (stored) {
        const session = JSON.parse(stored);
        const sessionData = {
          ...session,
          targetMinutes: session.targetMinutes || 480,
          laps: session.laps.map((lap: any) => ({
            ...lap,
            startTime: new Date(lap.startTime),
            endTime: new Date(lap.endTime)
          }))
        };
        setTodaySession(sessionData);
        setTargetMinutes(sessionData.targetMinutes);
      }
    }
  };

  const loadPreviousSessions = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('time_tracking_sessions')
        .select('*')
        .lt('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: false })
        .limit(7);

      if (error) {
        console.error('Error loading previous sessions:', error);
        return;
      }

      if (data) {
        const parsedSessions = data.map(session => ({
          date: new Date(session.date).toDateString(),
          laps: Array.isArray(session.laps) ? session.laps.map((lap: any) => ({
            id: lap.id,
            startTime: new Date(lap.startTime),
            endTime: new Date(lap.endTime),
            duration: lap.duration
          })) : [],
          totalMinutes: session.total_minutes || 0,
          breakCount: session.break_count || 0,
          breakDurationMinutes: session.break_duration_minutes || 0,
          targetMinutes: session.target_minutes || 480
        }));
        setPreviousSessions(parsedSessions);
      }
    } else {
      // Load from localStorage
      const sessions: SessionData[] = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const stored = localStorage.getItem(`timeTracker_${dateStr}`);
        if (stored) {
          const session = JSON.parse(stored);
          sessions.push({
            ...session,
            targetMinutes: session.targetMinutes || 480,
            laps: session.laps.map((lap: any) => ({
              ...lap,
              startTime: new Date(lap.startTime),
              endTime: new Date(lap.endTime)
            }))
          });
        }
      }
      setPreviousSessions(sessions);
    }
  };

  const saveSession = async (session: SessionData) => {
    if (user) {
      // Convert laps to JSON-serializable format
      const serializedLaps = session.laps.map(lap => ({
        id: lap.id,
        startTime: lap.startTime.toISOString(),
        endTime: lap.endTime.toISOString(),
        duration: lap.duration
      }));

      // Save to database
      const { error } = await supabase
        .from('time_tracking_sessions')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          laps: serializedLaps,
          total_minutes: session.totalMinutes,
          break_count: session.breakCount,
          break_duration_minutes: session.breakDurationMinutes,
          target_minutes: session.targetMinutes,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving session:', error);
        toast({
          title: "Error",
          description: "Failed to save session to database",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Save to localStorage
      localStorage.setItem(`timeTracker_${session.date}`, JSON.stringify({
        ...session,
        laps: session.laps.map(lap => ({
          ...lap,
          startTime: lap.startTime.toISOString(),
          endTime: lap.endTime.toISOString()
        }))
      }));
    }
  };

  const startTracking = () => {
    const startTime = new Date();
    setCurrentStart(startTime);
    setIsTracking(true);
    
    toast({
      title: "Timer Started",
      description: `Started tracking at ${startTime.toLocaleTimeString()}`
    });
  };

  const stopTracking = () => {
    if (!currentStart) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentStart.getTime()) / 60000); // in minutes

    const newLap: TimeLap = {
      id: Date.now().toString(),
      startTime: currentStart,
      endTime,
      duration
    };

    // Calculate break time
    let breakDuration = 0;
    if (todaySession.laps.length > 0) {
      const lastLap = todaySession.laps[todaySession.laps.length - 1];
      breakDuration = Math.floor((currentStart.getTime() - lastLap.endTime.getTime()) / 60000);
    }

    const updatedSession: SessionData = {
      ...todaySession,
      laps: [...todaySession.laps, newLap],
      totalMinutes: todaySession.totalMinutes + duration,
      breakCount: todaySession.laps.length > 0 ? todaySession.breakCount + 1 : todaySession.breakCount,
      breakDurationMinutes: todaySession.breakDurationMinutes + (breakDuration > 0 ? breakDuration : 0),
      targetMinutes: targetMinutes
    };

    setTodaySession(updatedSession);
    setIsTracking(false);
    setCurrentStart(null);
    
    // Reset snooze if active
    if (isSnoozing) {
      setIsSnoozing(false);
      setSnoozeEndTime(null);
      setSnoozeTimeLeft(0);
    }
    
    saveSession(updatedSession);
    
    toast({
      title: "Lap Completed",
      description: `Tracked ${minutesToTimeString(duration)} of work time`
    });
  };

  const getCurrentDuration = () => {
    if (!currentStart) return 0;
    return Math.floor((currentTime.getTime() - currentStart.getTime()) / 60000);
  };

  const getCurrentDurationSeconds = () => {
    if (!currentStart) return 0;
    return Math.floor((currentTime.getTime() - currentStart.getTime()) / 1000);
  };

  const handleTargetChange = (minutes: number) => {
    setTargetMinutes(minutes);
    const updatedSession = { ...todaySession, targetMinutes: minutes };
    setTodaySession(updatedSession);
    saveSession(updatedSession);
    
    // Reset target reached status if new target is higher
    if (minutes > todaySession.totalMinutes + getCurrentDuration()) {
      setIsTargetReached(false);
    }
  };

  const handleSnooze = (minutes: number) => {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + minutes);
    setSnoozeEndTime(endTime);
    setIsSnoozing(true);
    setSnoozeTimeLeft(minutes * 60 * 1000);
    
    toast({
      title: "Snooze Set",
      description: `Taking a ${minutes} minute break. Timer will remind you when it's time to get back to work!`
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getProgressPercentage = () => {
    const totalMinutes = todaySession.totalMinutes + getCurrentDuration();
    return Math.min((totalMinutes / targetMinutes) * 100, 100);
  };

  const SessionSummary = ({ session }: { session: SessionData }) => {
    const startTime = session.laps.length > 0 ? session.laps[0].startTime : null;
    const endTime = session.laps.length > 0 ? session.laps[session.laps.length - 1].endTime : null;

    return (
      <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="font-medium">
            📅 Date: {formatDate(new Date(session.date))}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-purple-500" />
          <span>🧩 Time Laps: {session.laps.length}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-500" />
          <span>⏱️ Total Time Tracked: {minutesToTimeString(session.totalMinutes)}</span>
        </div>
        
        {startTime && (
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-green-600" />
            <span>🟢 Start Time: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
        
        {endTime && (
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4 text-red-600" />
            <span>🔴 End Time: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-orange-500" />
          <span>✋ Breaks: {session.breakCount}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-orange-400" />
          <span>😴 Break Duration: {minutesToTimeString(session.breakDurationMinutes)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Time Tracker</h1>
        <Clock className="h-8 w-8 text-primary" />
      </div>

      {/* Target Time Settings */}
      <TargetTimeSettings
        targetMinutes={targetMinutes}
        onTargetChange={handleTargetChange}
        isTargetReached={isTargetReached}
        onSnooze={handleSnooze}
        isSnoozing={isSnoozing}
        snoozeTimeLeft={snoozeTimeLeft}
      />

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress towards target</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{minutesToTimeString(todaySession.totalMinutes + getCurrentDuration())}</span>
              <span>{formatTargetTime(targetMinutes)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={startTracking}
              disabled={isTracking}
              size="lg"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start
            </Button>
            
            <Button
              onClick={stopTracking}
              disabled={!isTracking}
              variant="destructive"
              size="lg"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>

          {isTracking && (
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-primary mb-2">
                {secondsToHHMMSS(getCurrentDurationSeconds())}
              </div>
              <p className="text-sm text-muted-foreground">
                Started at {currentStart?.toLocaleTimeString()}
              </p>
              {isSnoozing && (
                <div className="mt-2 text-sm text-green-600">
                  ⏳ Snoozing: {Math.ceil(snoozeTimeLeft / 60000)} min left
                </div>
              )}
            </div>
          )}

          {todaySession.laps.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Today's Laps:</h4>
              <div className="grid gap-2">
                {todaySession.laps.map((lap, index) => (
                  <div key={lap.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Lap {index + 1}</Badge>
                      <span className="text-sm">
                        {lap.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {lap.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="font-medium">{minutesToTimeString(lap.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Summary */}
      {todaySession.laps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionSummary session={todaySession} />
          </CardContent>
        </Card>
      )}

      {/* Previous Sessions */}
      {previousSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {previousSessions.map((session, index) => (
              <SessionSummary key={index} session={session} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeTracker;
