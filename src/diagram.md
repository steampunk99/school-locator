# User Roles and Features Diagram

```mermaid
graph TB
    subgraph "User Roles"
        Student["👨‍🎓 Student"]
        SchoolAdmin["👨‍💼 School Admin"]
        SuperAdmin["👨‍💻 Super Admin"]
    end

    subgraph "Public Features"
        Search["🔍 School Search & Filters"]
        Compare["⚖️ School Comparison"]
        View["👀 School Profiles"]
        Nearby["📍 Nearby Schools"]
        Performance["📊 Performance Rankings"]
    end

    subgraph "School Admin Features"
        Profile["✏️ School Profile Management"]
        Media["📸 Media Management"]
        Stats["📈 School Statistics"]
        Updates["📝 School Updates"]
        Performance_Update["🎯 Performance Updates"]
    end

    subgraph "Super Admin Features"
        Verify["✅ School Verification"]
        BulkOps["📦 Bulk Operations"]
        Analytics["📊 System Analytics"]
        UserMgmt["👥 User Management"]
        Settings["⚙️ System Settings"]
    end

    %% Public access connections
    Student --> Search
    Student --> Compare
    Student --> View
    Student --> Nearby
    Student --> Performance

    %% School Admin access
    SchoolAdmin --> Search
    SchoolAdmin --> Compare
    SchoolAdmin --> View
    SchoolAdmin --> Profile
    SchoolAdmin --> Media
    SchoolAdmin --> Stats
    SchoolAdmin --> Updates
    SchoolAdmin --> Performance_Update

    %% Super Admin access
    SuperAdmin --> Search
    SuperAdmin --> Compare
    SuperAdmin --> View
    SuperAdmin --> Profile
    SuperAdmin --> Media
    SuperAdmin --> Stats
    SuperAdmin --> Updates
    SuperAdmin --> Performance_Update
    SuperAdmin --> Verify
    SuperAdmin --> BulkOps
    SuperAdmin --> Analytics
    SuperAdmin --> UserMgmt
    SuperAdmin --> Settings

    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef userRole fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef publicFeature fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef adminFeature fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef superFeature fill:#fce4ec,stroke:#c2185b,stroke-width:2px

    class Student,SchoolAdmin,SuperAdmin userRole
    class Search,Compare,View,Nearby,Performance publicFeature
    class Profile,Media,Stats,Updates,Performance_Update adminFeature
    class Verify,BulkOps,Analytics,UserMgmt,Settings superFeature
