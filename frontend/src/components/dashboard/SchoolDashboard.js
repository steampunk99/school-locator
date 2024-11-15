import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { FaUser, FaBook } from 'react-icons/fa';

export default function SchoolDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">School Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <FaUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Courses
            </CardTitle>
            <FaBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
