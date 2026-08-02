# Course Admin Module

This module provides comprehensive course management functionality for administrators.

## Features

1. **Course Listing**
   - View all courses in a grid layout
   - Filter courses by various criteria (category, price, visibility, etc.)
   - Pagination support for large datasets

2. **Course Creation**
   - Create new courses with detailed information
   - Upload thumbnail and logo images
   - Set pricing, categories, and other metadata

3. **Course Editing**
   - Edit existing course details
   - Update images and metadata
   - Modify course content and structure

4. **Course Management Actions**
   - Publish/Unpublish courses
   - Feature/Unfeature courses
   - Delete courses
   - Moderate courses (approve/reject)

## Components

- `CourseAdminPage` - Main admin page for course management
- `CourseList` - Displays courses in a grid layout
- `CourseCard` - Individual course card with actions
- `CourseFilters` - Filtering options for courses
- `CreateCourseModal` - Modal for creating new courses
- `EditCourseModal` - Modal for editing existing courses

## API Integration

The module integrates with the following backend endpoints:

- `GET /course/all-courses` - Fetch all courses with filtering
- `POST /course/create` - Create a new course
- `PUT /course/:id` - Update an existing course
- `PATCH /course/delete/:id` - Soft delete a course
- `PATCH /course/publish/:id` - Toggle course publish status
- `PATCH /course/feature/:id` - Toggle course featured status
- `PATCH /course/moderate/:id` - Moderate a course (approve/reject)
- `PATCH /course/thumbnail/:id` - Update course media (thumbnail/logo)
- `PATCH /course/seo/:id` - Update course SEO information

## Usage

1. Navigate to `/admin/courses` in the admin panel
2. Use filters to find specific courses
3. Click "Create New Course" to add a new course
4. Click "Edit" on any course card to modify course details
5. Use action buttons to manage course status:
   - Publish/Unpublish
   - Feature/Unfeature
   - Approve/Reject
   - Delete

## Styling

The module uses Tailwind CSS classes for styling with dark mode support. Custom CSS is also included in `CourseAdmin.css` for consistent styling across components.