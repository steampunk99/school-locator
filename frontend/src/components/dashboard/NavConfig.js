import { 
    SquareTerminal, 
    Bot, 
    LifeBuoy, 
    Send,
    // ... other icons
  } from "lucide-react"
  
  export const navigationConfig = {
    superAdmin: {
      main: [
        {
          title: "School Management",
          icon: SquareTerminal,
          items: [
            { title: "Schools", path: "/super-admin/schools" },
            { title: "Applications", path: "/super-admin/applications" },
            { title: "Settings", path: "/super-admin/settings" },
          ],
        },
        // ... more items
      ],
      secondary: [
        { title: "Support", icon: LifeBuoy, path: "/support" },
        { title: "Feedback", icon: Send, path: "/feedback" },
      ],
    },
    admin: {
      main: [
        {
          title: "School Dashboard",
          icon: SquareTerminal,
          items: [
            { title: "Overview", path: "/admin/overview" },
            { title: "Students", path: "/admin/students" },
            // ... more items
          ],
        },
      ],
      // ... secondary items
    },
    student: {
      main: [
        {
          title: "My Education",
          icon: Bot,
          items: [
            { title: "Courses", path: "/student/courses" },
            { title: "Grades", path: "/student/grades" },
            // ... more items
          ],
        },
      ],
      // ... secondary items
    },
  }