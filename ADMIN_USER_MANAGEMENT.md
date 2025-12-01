# Admin User Management Feature

## Overview
This implementation adds user management functionality for administrators in the Virtual Medical Coaching application. Administrators can now manage coaches and patient users through a dedicated interface.

## Features Implemented

### 1. **Admin Users Management Component**
   - **Location**: `src/app/components/admin-users/`
   - **Files**:
     - `admin-users.component.ts` - Component logic
     - `admin-users.component.html` - Component template
     - `admin-users.component.scss` - Component styles
     - `admin-users.component.spec.ts` - Component tests

### 2. **Admin Service**
   - **Location**: `src/app/services/admin.service.ts`
   - **Functionality**: Provides HTTP endpoints for managing users
   - **Methods**:
     - `getAllUsers()` - Retrieve all users
     - `getUserById(id)` - Get a specific user
     - `createUser(user)` - Create a new user
     - `updateUser(id, user)` - Update an existing user
     - `deleteUser(id)` - Delete a user
     - `getUsersByRole(role)` - Filter users by role

### 3. **Component Features**

#### User Management Operations
- ✅ **Add Users**: Create new coaches or patients with form validation
- ✅ **Edit Users**: Update existing user information
- ✅ **Delete Users**: Remove users from the system
- ✅ **View All Users**: Display all users in a table format
- ✅ **Filter & Search**: 
  - Filter by role (Coach, Patient, Admin)
  - Search by name, first name, or email

#### User Interface Elements
- **Header**: Clearly states the admin can manage coaches and patient users
- **Toolbar**: "Add User" button for creating new users
- **Filters**: Role filter and search bar for easy user discovery
- **Form**: Modal-like form for adding/editing users with fields:
  - Nom (Last Name)
  - Prénom (First Name)
  - Email
  - Téléphone (Phone)
  - Rôle (Role)
  - Mot de passe (Password - only for new users)
- **Users Table**: Displays all users with:
  - Name, First Name, Email, Phone
  - Role badges (color-coded)
  - Edit and Delete action buttons
- **Alerts**: Success and error messages for all operations

### 4. **Styling**
- Modern, professional design with:
  - Color-coded role badges (Coach: Blue, Patient: Green, Admin: Red)
  - Responsive grid layout
  - Hover effects on interactive elements
  - Mobile-friendly design
  - Smooth transitions and animations

### 5. **Navigation Integration**
- **Navbar Updates**: Added admin link to both desktop and mobile navigation
- **Route**: `/admin-users` with AuthGuard protection
- **Visibility**: Only displayed for users with 'ADMIN' role

## File Structure
```
src/app/
├── components/
│   └── admin-users/
│       ├── admin-users.component.ts
│       ├── admin-users.component.html
│       ├── admin-users.component.scss
│       └── admin-users.component.spec.ts
├── services/
│   ├── admin.service.ts
│   └── admin.service.spec.ts
├── app-routing.module.ts (updated)
├── app.module.ts (updated)
└── navbar/
    └── navbar.component.html (updated)
```

## Module Configuration

### App Module Updates
The `AdminUsersComponent` has been:
1. Imported in `app.module.ts`
2. Declared in the module declarations
3. Made available throughout the application

### Routing Configuration
Added route in `app-routing.module.ts`:
```typescript
{ path: 'admin-users', component: AdminUsersComponent, canActivate: [AuthGuard] }
```

## API Integration

The component expects the following API endpoints (backend):
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get user by ID
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/users/role/{role}` - Get users by role

**Note**: Update the `apiUrl` in `admin.service.ts` to match your backend URL:
```typescript
private apiUrl = 'http://localhost:8080/api/admin'; // Adjust this URL
```

## Usage Instructions

### For Admins:
1. Log in with an admin account
2. Navigate to "Gestion Utilisateurs" from the main menu
3. Use the interface to:
   - **Add**: Click "+ Ajouter un utilisateur"
   - **Edit**: Click "Modifier" on any user row
   - **Delete**: Click "Supprimer" on any user row
   - **Filter**: Use the role dropdown to filter by role
   - **Search**: Use the search bar to find users by name or email

## Error Handling
- Form validation for required fields and email format
- User confirmation dialog before deletion
- Error messages displayed for failed operations
- Success messages for completed operations

## Role-Based Access Control
- Component is only accessible to users with 'ADMIN' role
- Protected by `AuthGuard` on the route
- Navigation links only display for admin users

## Future Enhancements
- Pagination for large user lists
- Export user data to CSV/PDF
- Bulk user operations
- User activity logging
- Advanced search filters
- User role change history
