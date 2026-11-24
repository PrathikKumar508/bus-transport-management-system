# Shared API and Data Contract

This document is the integration contract for all three team members. Keep field names, role names, and response shapes consistent across modules.

## Local services

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB database: `college_transport`

## Authentication

Protected requests must send:

```http
Authorization: Bearer <jwt-token>
```

Available roles are exactly:

```text
admin
student
driver
```

Admin management endpoints must use both authentication and Admin authorization. Students and drivers must only receive records relevant to their own account or assignments.

## Common response conventions

Successful collection responses use a named array:

```json
{ "buses": [] }
```

Successful single-record responses use a named object:

```json
{ "bus": {} }
```

Errors use:

```json
{ "message": "Human-readable error message" }
```

## Existing Member 1 models

### User

```text
_id
name: string
email: string, unique, lowercase
password: hashed string, never return to clients
role: admin | student | driver
isActive: boolean
```

### Bus

```text
_id
busNumber: string, unique, uppercase
registrationNumber: string, unique, uppercase
capacity: positive integer
status: available | active | maintenance
```

### Driver

```text
_id
name: string
licenseNumber: string, unique, uppercase
phone: string
email: string, lowercase
status: available | assigned | inactive
```

## Existing endpoints

### Authentication

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register student or driver |
| POST | `/api/auth/login` | Public | Return JWT and public user |
| GET | `/api/auth/me` | Authenticated | Return current user |

### Buses

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/buses` | Admin | List buses |
| GET | `/api/buses/:id` | Admin | Get one bus |
| POST | `/api/buses` | Admin | Create bus |
| PUT | `/api/buses/:id` | Admin | Update bus |
| DELETE | `/api/buses/:id` | Admin | Delete bus |

### Drivers

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/drivers` | Admin | List drivers |
| GET | `/api/drivers/:id` | Admin | Get one driver |
| POST | `/api/drivers` | Admin | Create driver |
| PUT | `/api/drivers/:id` | Admin | Update driver |
| DELETE | `/api/drivers/:id` | Admin | Delete driver |

## Contracts for Member 2

### Route

```text
_id
name: string
description: string, optional
isActive: boolean
```

### Stop

```text
_id
routeId: ObjectId, required
name: string
sequence: positive integer
pickupTime: string, optional
```

Recommended endpoints:

```text
GET    /api/routes
POST   /api/routes
GET    /api/routes/:id
PUT    /api/routes/:id
DELETE /api/routes/:id
GET    /api/routes/:routeId/stops
POST   /api/routes/:routeId/stops
PUT    /api/stops/:id
DELETE /api/stops/:id
```

### Schedule

```text
_id
routeId: ObjectId, required
busId: ObjectId, required
driverId: ObjectId, required
day: string
departureTime: string
arrivalTime: string
status: scheduled | active | cancelled
```

Schedule creation must verify that the referenced bus and driver exist and that the driver has no overlapping assignment.

## Contracts for Member 3

### Student

```text
_id
userId: ObjectId, required
studentId: string, unique
name: string
department: string
year: string
phone: string, optional
```

### Allocation

```text
_id
studentId: ObjectId, required
busId: ObjectId, required
routeId: ObjectId, required
stopId: ObjectId, required
scheduleId: ObjectId, optional
status: active | cancelled
allocatedAt: date
```

Allocation creation must verify:

1. Student, bus, route, and stop exist.
2. The stop belongs to the selected route.
3. The bus has remaining capacity.
4. The student has no other active allocation.

Recommended endpoints:

```text
GET    /api/students
POST   /api/students
GET    /api/students/me
POST   /api/allocations
GET    /api/allocations
GET    /api/allocations/me
PUT    /api/allocations/:id/cancel
```

## Integration rules

- Use `ObjectId` references between collections; do not duplicate full records.
- Do not rename the existing fields without discussing it with the team.
- Do not return password hashes in API responses.
- Use the existing error response format.
- Keep Admin-only operations protected with `authorize('admin')`.
- Add new routes in `server/server.js` using the `/api/...` prefix.
- Update this document when a field or endpoint is agreed to change.
