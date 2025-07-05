
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  totalHours?: number;
  status: 'present' | 'late' | 'absent' | 'early-logout';
}

interface AttendanceTrackingProps {
  employeeId: string;
}

const AttendanceTracking = ({ employeeId }: AttendanceTrackingProps) => {
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState<{ checkIn: string } | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Load attendance records from localStorage
    const stored = localStorage.getItem(`attendance-${employeeId}`);
    if (stored) {
      setAttendanceRecords(JSON.parse(stored));
    }

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = JSON.parse(stored || '[]').find((record: AttendanceRecord) => record.date === today);
    if (todayRecord && !todayRecord.checkOut) {
      setIsCheckedIn(true);
      setCurrentSession({ checkIn: todayRecord.checkIn });
    }
  }, [employeeId]);

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const dateString = now.toISOString().split('T')[0];
    
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date: dateString,
      checkIn: timeString,
      status: now.getHours() > 9 ? 'late' : 'present'
    };

    const updatedRecords = [...attendanceRecords, newRecord];
    setAttendanceRecords(updatedRecords);
    localStorage.setItem(`attendance-${employeeId}`, JSON.stringify(updatedRecords));
    
    setIsCheckedIn(true);
    setCurrentSession({ checkIn: timeString });
    
    toast({
      title: "Checked In Successfully",
      description: `Check-in time: ${timeString}`,
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const dateString = now.toISOString().split('T')[0];
    
    const updatedRecords = attendanceRecords.map(record => {
      if (record.date === dateString && !record.checkOut) {
        const checkInTime = new Date(`${dateString}T${record.checkIn}`);
        const checkOutTime = new Date(`${dateString}T${timeString}`);
        const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...record,
          checkOut: timeString,
          totalHours: Math.round(totalHours * 100) / 100,
          status: totalHours < 8 ? 'early-logout' : record.status
        };
      }
      return record;
    });

    setAttendanceRecords(updatedRecords);
    localStorage.setItem(`attendance-${employeeId}`, JSON.stringify(updatedRecords));
    
    setIsCheckedIn(false);
    setCurrentSession(null);
    
    toast({
      title: "Checked Out Successfully",
      description: `Check-out time: ${timeString}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'early-logout': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0);
  const lateEntries = attendanceRecords.filter(record => record.status === 'late').length;
  const earlyLogouts = attendanceRecords.filter(record => record.status === 'early-logout').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Attendance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              {!isCheckedIn ? (
                <Button onClick={handleCheckIn} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Check In
                </Button>
              ) : (
                <Button onClick={handleCheckOut} variant="outline" className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Check Out
                </Button>
              )}
            </div>

            {currentSession && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Checked in at: <strong>{currentSession.checkIn}</strong>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{lateEntries}</p>
                <p className="text-sm text-gray-600">Late Entries</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{earlyLogouts}</p>
                <p className="text-sm text-gray-600">Early Logouts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {attendanceRecords.slice(-10).reverse().map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{record.date}</p>
                  <p className="text-sm text-gray-600">
                    {record.checkIn} - {record.checkOut || 'Not checked out'} 
                    {record.totalHours && ` (${record.totalHours}h)`}
                  </p>
                </div>
                <Badge className={getStatusColor(record.status)}>
                  {record.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTracking;
