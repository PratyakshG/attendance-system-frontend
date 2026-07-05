type AttendanceList = {
  checkIn: string;
  checkOut: string;
  date: string;
  scanStatus: string;
  status: string;
  user: {
    _id: string;
    name: string;
    role: string;
    uid: string;
    employeeId: string;
  };
};

type Employee = {
  _id: string;
  name: string;
  employeeId: string;
  uid: string;
  role: string;
  email: string;
  address: string;
  profileImage: File;
  isActive: boolean;
  phoneNumber: number;
};

type UID = {
  _id: string;
  uid: string;
  status: string;
  employeeName: string;
  employeeId: string;
};

type DashboardTypes = {
  stats: {
    totalEmployees: number;
    presentEmployees: number;
    absentEmployees: number;
    employeesOnLeave: number;
  };
  liveStatus: {
    absent: [];
    present: [];
    onLeave: [];
  };
  pendingLeaves: Array<{
    user: {
      name: string;
      email: string;
      uid: string;
    };
    startDate: Date;
    endDate: Date;
    reason: string;
    status: string;
  }>;
  complaintStats: {
    new: number;
    inProcess: number;
    resolved: number;
  };
  recentComplaints: Array<{
    subject: string;
    description: string;
    user: {
      name: string;
      email: string;
      uid: string;
    };
  }>;
  notifications: {
    newLeaves: number;
    newComplaints: number;
  };
  notices: Array<Notice>;
};

type Leave = {
  _id: string;
  user: {
    name: string;
    uid: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

type Complaint = {
  _id: string;
  user: {
    _id: string;
    name: string;
    uid: string;
  };
  subject: string;
  description: string;
  status: string;
  createdAt: Date;
};

type Notice = {
  _id: string;
  title: string;
  content: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: Date;
};

type User = {
  _id: string;
  uid: string | undefined;
  name: string;
  role: string;
  email: string | undefined;
  employeeId?: string;
};
