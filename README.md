# E-commerce Admin Dashboard

A comprehensive, production-ready admin dashboard for managing an e-commerce platform built with React 18, TypeScript, Tailwind CSS, Redux Toolkit, and React Router DOM v6.

## Features

- 🎯 **User Management**: Complete user CRUD operations, role management, and verification
- 📦 **Product Management**: Advanced product catalog with multi-image upload, stock tracking
- 📋 **Order Management**: Order processing, status updates, and invoice generation
- ⭐ **Review Management**: Moderation and management of product reviews
- ❓ **FAQ Management**: Create and manage product FAQs
- 📊 **Analytics Dashboard**: Comprehensive metrics and performance tracking
- 🌙 **Dark Mode**: Full dark mode support
- 🔐 **Role-Based Access**: Admin and staff role permissions
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ♿ **Accessibility**: WCAG 2.1 compliant

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v3.4
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router DOM v6
- **UI Components**: Headless UI
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js & Recharts
- **Tables**: TanStack Table v8
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

4. Preview production build:
   \`\`\`bash
   npm run preview
   \`\`\`

## Project Structure

\`\`\`
src/
├── components/
│ ├── ui/ # Reusable UI components
│ ├── layout/ # Layout components (Header, Sidebar)
│ ├── forms/ # Form components
│ └── charts/ # Chart components
├── pages/ # Page components
│ ├── Dashboard/
│ ├── Users/
│ ├── Products/
│ ├── Orders/
│ ├── Reviews/
│ ├── FAQs/
│ └── Analytics/
├── store/ # Redux store
│ ├── slices/ # Redux slices
│ └── api/ # RTK Query API
├── hooks/ # Custom React hooks
├── utils/ # Helper functions
├── types/ # TypeScript types
└── styles/ # Global styles
\`\`\`

## API Endpoints

### User Management

- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:userId` - Update user
- `DELETE /api/admin/users/:userId` - Delete user

### Product Management

- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:productId` - Update product
- `DELETE /api/admin/products/:productId` - Delete product

### Order Management

- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/:orderId/status` - Update order status
- `GET /api/admin/orders/:orderId` - Get order details

### Review Management

- `GET /api/admin/reviews` - List all reviews
- `DELETE /api/admin/reviews/:reviewId` - Delete review

### FAQ Management

- `GET /api/admin/faqs` - List all FAQs
- `POST /api/admin/faqs` - Create FAQ
- `PUT /api/admin/faqs/:faqId` - Update FAQ
- `DELETE /api/admin/faqs/:faqId` - Delete FAQ

### Analytics

- `GET /api/admin/analytics/dashboard` - Dashboard metrics
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/analytics/products` - Product performance

## Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
VITE_API_BASE_URL=http://localhost:5000/api
\`\`\`

## License

MIT
