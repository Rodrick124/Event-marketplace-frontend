# Admin Dashboard API Endpoints

This document outlines the API endpoints required for the admin dashboard functionality.

## Authentication
All admin endpoints require authentication with admin role:
```
Authorization: Bearer <admin_jwt_token>
```

## Dashboard Statistics

### Get Admin Dashboard Stats
**Endpoint:** `GET /admin/dashboard/stats`
**Description:** Get comprehensive dashboard statistics
**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalEvents": 340,
    "totalReservations": 2890,
    "totalRevenue": 125000.50,
    "activeEvents": 85,
    "pendingReservations": 45,
    "newUsersThisMonth": 120,
    "revenueThisMonth": 15000.00,
    "topCategories": [
      {
        "category": "Music",
        "eventCount": 120,
        "revenue": 45000.00,
        "reservationCount": 890
      }
    ],
    "recentActivity": [
      {
        "_id": "activity_id",
        "type": "user_registration",
        "description": "New user registered: John Doe",
        "userId": "user_id",
        "timestamp": "2024-01-15T10:30:00Z",
        "metadata": {}
      }
    ]
  }
}
```

## User Management

### Get All Users
**Endpoint:** `GET /admin/users`
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or email
- `status` - Filter by status (active, inactive, banned)
- `sortBy` - Sort field (registrationDate, name, totalSpent)
- `sortOrder` - Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "initials": "JD",
      "phone": "+1234567890",
      "bio": "Event enthusiast",
      "registrationDate": "2024-01-01T00:00:00Z",
      "lastLoginDate": "2024-01-15T10:30:00Z",
      "isActive": true,
      "isBanned": false,
      "totalReservations": 15,
      "totalSpent": 750.00,
      "verificationStatus": "verified",
      "organization": "Tech Corp",
      "website": "https://example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1250,
    "pages": 125
  }
}
```

### Get User Details
**Endpoint:** `GET /admin/users/:userId`
**Response:** Single user object with detailed information

### Ban/Unban User
**Endpoint:** `PATCH /admin/users/:userId/ban`
**Body:**
```json
{
  "banned": true,
  "reason": "Violation of terms"
}
```

### Update User Verification
**Endpoint:** `PATCH /admin/users/:userId/verification`
**Body:**
```json
{
  "status": "verified", // verified, rejected
  "reason": "Documents approved"
}
```

## Event Management

### Get All Events
**Endpoint:** `GET /admin/events`
**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `sortOrder` (same as users)
- `status` - Filter by status (published, draft, cancelled, completed)
- `category` - Filter by category
- `approvalStatus` - Filter by approval (pending, approved, rejected)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "event_id",
      "title": "Tech Conference 2024",
      "description": "Annual technology conference",
      "date": "2024-03-15",
      "time": "09:00",
      "location": "Convention Center",
      "capacity": 500,
      "price": 150.00,
      "category": "Technology",
      "image": "event_image_url",
      "availableSeats": 250,
      "organizer": {
        "_id": "organizer_id",
        "name": "Event Organizer",
        "email": "organizer@example.com"
      },
      "totalReservations": 250,
      "totalRevenue": 37500.00,
      "status": "published",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "isApproved": true,
      "approvalStatus": "approved"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 340,
    "pages": 34
  }
}
```

### Get Event Details
**Endpoint:** `GET /admin/events/:eventId`
**Response:** Single event object with detailed information

### Update Event Approval
**Endpoint:** `PATCH /admin/events/:eventId/approval`
**Body:**
```json
{
  "status": "approved", // approved, rejected
  "reason": "Event meets all requirements"
}
```

### Delete Event
**Endpoint:** `DELETE /admin/events/:eventId`
**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

## Reservation Management

### Get All Reservations
**Endpoint:** `GET /admin/reservations`
**Query Parameters:** Same as other endpoints plus:
- `status` - Filter by reservation status
- `paymentStatus` - Filter by payment status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "reservation_id",
      "userId": "user_id",
      "eventId": "event_id",
      "event": {
        "_id": "event_id",
        "title": "Tech Conference 2024",
        "date": "2024-03-15",
        "time": "09:00",
        "location": "Convention Center"
      },
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "ticketQuantity": 2,
      "totalAmount": 300.00,
      "status": "confirmed",
      "paymentStatus": "completed",
      "reservationDate": "2024-01-10T10:00:00Z",
      "paymentMethod": "credit_card",
      "transactionId": "txn_123456",
      "notes": "VIP seating requested",
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2890,
    "pages": 289
  }
}
```

## Activity Logs

### Get Activity Logs
**Endpoint:** `GET /admin/activity-logs`
**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `sortOrder`
- `type` - Filter by activity type
- `dateFrom`, `dateTo` - Date range filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "log_id",
      "type": "user_registration",
      "description": "New user registered: John Doe",
      "userId": "user_id",
      "eventId": null,
      "timestamp": "2024-01-15T10:30:00Z",
      "metadata": {
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.1"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000,
    "pages": 250
  }
}
```

## Analytics

### Get Revenue Analytics
**Endpoint:** `GET /admin/analytics/revenue`
**Query Parameters:**
- `period` - Time period (week, month, year)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "revenue": 5000.00,
      "reservations": 50
    },
    {
      "date": "2024-01-02",
      "revenue": 7500.00,
      "reservations": 75
    }
  ]
}
```

### Get User Growth Analytics
**Endpoint:** `GET /admin/analytics/users`
**Query Parameters:**
- `period` - Time period (week, month, year)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "newUsers": 25,
      "totalUsers": 1000
    },
    {
      "date": "2024-01-02",
      "newUsers": 30,
      "totalUsers": 1030
    }
  ]
}
```

## Data Export

### Export Users
**Endpoint:** `GET /admin/export/users`
**Query Parameters:** Same filtering options as GET users
**Response:** CSV file download

### Export Events
**Endpoint:** `GET /admin/export/events`
**Query Parameters:** Same filtering options as GET events
**Response:** CSV file download

### Export Reservations
**Endpoint:** `GET /admin/export/reservations`
**Query Parameters:** Same filtering options as GET reservations
**Response:** CSV file download

## System Settings

### Get System Settings
**Endpoint:** `GET /admin/settings`
**Response:**
```json
{
  "success": true,
  "data": {
    "general": {
      "siteName": "Event Marketplace",
      "siteDescription": "Your premier destination for event booking",
      "contactEmail": "admin@eventmarketplace.com",
      "timezone": "UTC",
      "currency": "USD"
    },
    "security": {
      "requireEmailVerification": true,
      "sessionTimeout": 30,
      "maxLoginAttempts": 5
    },
    "events": {
      "requireEventApproval": true,
      "maxEventsPerOrganizer": 50,
      "commissionRate": 5.0
    }
  }
}
```

### Update System Settings
**Endpoint:** `PUT /admin/settings`
**Body:** Settings object (same structure as GET response)

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Rate Limiting

Admin endpoints should implement rate limiting:
- General endpoints: 100 requests per minute
- Export endpoints: 5 requests per minute
- Bulk operations: 10 requests per minute

## Security Considerations

1. **Admin Authentication**: Verify admin role on every request
2. **Input Validation**: Sanitize all inputs
3. **Audit Logging**: Log all admin actions
4. **IP Restrictions**: Consider IP whitelisting for admin access
5. **Session Management**: Implement secure session handling
6. **Data Privacy**: Ensure sensitive data is properly protected

## Implementation Notes

1. **Pagination**: Implement consistent pagination across all list endpoints
2. **Filtering**: Support multiple filter combinations
3. **Sorting**: Allow sorting by multiple fields
4. **Search**: Implement full-text search where applicable
5. **Caching**: Cache frequently accessed data (stats, settings)
6. **Performance**: Optimize queries for large datasets
7. **Monitoring**: Implement endpoint monitoring and alerting