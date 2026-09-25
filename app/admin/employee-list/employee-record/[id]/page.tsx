"use client";

// import ActionsMenu from "@/components/ActionsMenu";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
// import { useFetchEmployees } from "@/hooks/useFetchEmployees";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarMinus,
  Check,
  ClockAlert,
  Hash,
  IdCard,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type UserData = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  uid: string;
  employeeId: string;
  profileImage: string;
};

type SummaryData = {
  presentDays: number;
  absentDays: number;
  totalWorkingDays: number;
  halfDays: number;
  lateDays: number;
};

type AttendanceRecord = {
  checkIn: string;
  checkOut: string;
  date: string;
  scanStatus: string;
  status: string;
  isLate: boolean;
  workMinutes: string;
  user: UserData;
};

const EmployeeCalendar = () => {
  const { id } = useParams();
  const [user, setUser] = useState<Employee>();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SummaryData>({
    presentDays: 0,
    absentDays: 0,
    totalWorkingDays: 0,
    halfDays: 0,
    lateDays: 0,
  });
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const month = format(currentMonth, "yyyy-MM");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/user/${id}?month=${month}`,
        ).then((res) => res.json());

        if (!response.success) {
          throw new Error("failed to fetch attendance record");
        }

        const data = response.data;

        if (response.success) {
          if (data) {
            setAttendance(data);
            setStats(response.summary);
            setUser(response.user);
          } else {
            setAttendance([]);
            setStats({
              presentDays: 0,
              absentDays: 0,
              totalWorkingDays: 0,
              halfDays: 0,
              lateDays: 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [currentMonth, id]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add rest of the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getAttendanceForDate = (day: number | null) => {
    if (!day) return;

    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return attendance.find((a: AttendanceList) => a.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
      case "OUT":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ABSENT":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // const { fetchEmployees } = useFetchEmployees();

  return (
    <section className="space-y-5 relative h-full flex flex-col">
      <Header text={`Attendance Record`} />

      <div className="flex max-lg:flex-col gap-5">
        {/* Employee Details */}
        <div className="flex lg:flex-col gap-3">
          <Image
            src={user?.profileImage ?? "/images/placeholder-img.jpg"}
            alt="profile-picture"
            className="aspect-4/5 max-w-3xs w-full bg-neutral-200 rounded-lg border object-fill object-center"
            width={400}
            height={500}
          />
          {/* Need to add ActionsMenu -> update, edit or delete details of the employee */}

          <div className="space-y-2 mt-3">
            <div>
              <h3 className="font-bold text-2xl lg:text-3xl leading-none text-nowrap">
                {user?.name}
              </h3>
              <span className="text-sm font-medium">{user?.role}</span>
            </div>

            <h3 className="flex items-center max-w-2xs w-full *:min-w-fit gap-2 text-sm">
              <Hash size={16} />
              {user?.employeeId}
            </h3>

            <h3 className="flex items-center max-w-2xs w-full *:min-w-fit gap-2 text-sm">
              <IdCard size={16} />
              {user?.uid}
            </h3>

            <h3 className="flex items-center max-w-2xs w-full *:min-w-fit gap-2 text-sm">
              <Phone size={16} />
              {user?.phoneNumber}
            </h3>

            <h3 className="flex items-center max-w-2xs w-full *:min-w-fit gap-2 text-sm">
              <Mail size={16} />
              {user?.email}
            </h3>

            <h3 className="flex items-start max-w-2xs w-full *:min-w-fit gap-2 text-sm">
              <MapPin size={16} />
              {user?.address}
            </h3>
          </div>
        </div>

        {loading && (
          <div className="grid max-lg:grid-rows-7 lg:grid-cols-11 gap-6 h-full py-5">
            <div className="max-lg:row-span-5 lg:col-span-8 w-full h-full bg-neutral-200 rounded-lg animate-pulse" />

            <div className="flex lg:flex-col max-lg:row-span-2 lg:col-span-3 gap-5 lg:w-full lg:h-full *:w-1/4 *:lg:w-full *:lg:h-full *:bg-neutral-200 *:rounded-md *:animate-pulse">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              {/* Calendar */}
              <div className="bg-white rounded-lg shadow-md w-full border">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="lg:text-lg font-medium text-gray-900">
                    Attendance Calendar
                  </h3>
                  <div className="max-lg:text-sm flex items-center lg:space-x-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      ←
                    </button>
                    <span className="font-medium text-gray-900">
                      {format(currentMonth, "MMMM y")}
                    </span>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                      const attendanceRecord = getAttendanceForDate(day);

                      return (
                        <div key={index} className="aspect-square relative">
                          {day && (
                            <div
                              className={`w-full h-full border-2 rounded-lg p-2 ${
                                attendanceRecord
                                  ? getStatusColor(attendanceRecord.status)
                                  : "bg-gray-50 border-gray-200"
                              }`}
                              onMouseEnter={() =>
                                !isMobile && setHoveredDate(day)
                              }
                              onMouseLeave={() =>
                                !isMobile && setHoveredDate(null)
                              }
                              onClick={() => isMobile && setHoveredDate(day)}
                            >
                              <div className="text-sm font-medium">{day}</div>
                              {attendanceRecord && hoveredDate === day && (
                                <div
                                  className={cn(
                                    "whitespace-nowrap text-xs",
                                    "w-fit max-md:z-10 max-md:absolute max-md:-top-10 max-md:left-1/2 max-md:-translate-x-1/2",
                                    "max-md:rounded-md max-md:border max-md:px-2 max-md:py-1 lg:mt-1",
                                  )}
                                >
                                  <div>{attendanceRecord?.checkIn}</div>
                                  {attendanceRecord?.checkOut && (
                                    <div>{attendanceRecord.checkOut}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex lg:flex-col grow-0 gap-2 lg:gap-5 items-start max-h-fit lg:max-w-3xs w-full *:w-full *:h-full">
                <div className="rounded-xl shadow p-3 lg:p-5 space-y-2 bg-green-100">
                  <div className="flex items-center gap-2">
                    <Check className="bg-green-600 p-1 lg:p-2 rounded-full size-6 lg:size-10 text-white" />
                    <span className="font-bold text-xl leading-none">
                      {stats?.presentDays}
                    </span>
                  </div>
                  <span className="text-green-600 font-medium">
                    Present Days
                  </span>
                </div>

                <div className="rounded-xl shadow p-3 lg:p-5 space-y-2 bg-amber-100">
                  <div className="flex items-center gap-2">
                    <ClockAlert className="bg-amber-600 p-1 lg:p-2 rounded-full size-6 lg:size-10 text-white" />
                    <span className="font-bold text-xl leading-none">
                      {stats?.lateDays}
                    </span>
                  </div>
                  <span className="text-amber-600 font-medium">Late Days</span>
                </div>

                <div className="rounded-xl shadow p-3 lg:p-5 space-y-2 bg-red-100">
                  <div className="flex items-center gap-2">
                    <X className="bg-red-600 p-1 lg:p-2 rounded-full size-6 lg:size-10 text-white" />
                    <span className="font-bold text-xl leading-none">
                      {stats?.absentDays}
                    </span>
                  </div>
                  <span className="text-red-600 font-medium">Absent Days</span>
                </div>

                <div className="rounded-xl shadow p-3 lg:p-5 space-y-2 bg-amber-100">
                  <div className="flex items-center gap-2">
                    <CalendarMinus className="bg-amber-600 p-1 lg:p-2 rounded-full size-6 lg:size-10 text-white" />
                    <span className="font-bold text-xl leading-none">
                      {stats?.totalWorkingDays}
                    </span>
                  </div>
                  <span className="text-amber-600 font-medium">
                    Working Days
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EmployeeCalendar;
