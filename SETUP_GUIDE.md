# E-commerce Admin Dashboard - Setup Guide

## Project Structure Created

The complete admin dashboard has been successfully created with the following structure:

```
E-commerce-app_Dashboard/
├── src/
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   ├── layout/                  # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── dashboard/               # Dashboard-specific components
│   │       ├── MetricCard.tsx
│   │       ├── SalesChart.tsx
│   │       └── RecentOrders.tsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── Users/
│   │   │   ├── UsersList.tsx
│   │   │   └── UserFormModal.tsx
│   │   ├── Products/
│   │   │   ├── ProductsList.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── Orders/
│   │   │   ├── OrdersList.tsx
│   │   │   └── OrderDetails.tsx
│   │   ├── Reviews/
│   │   │   └── ReviewsList.tsx
│   │   ├── FAQs/
│   │   │   ├── FAQsList.tsx
│   │   │   └── FAQFormModal.tsx
│   │   ├── Analytics/
│   │   │   └── Analytics.tsx
│   │   └── Auth/
│   │       └── Login.tsx
│   ├── store/
│   │   ├── api/
│   │   │   └── adminApi.ts          # RTK Query API definitions
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── themeSlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── utils/
│   │   └── formatters.ts            # Utility functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .gitignore
└── README.md
```

## Installation Steps

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:

- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Redux Toolkit 2.1.0
- React Router DOM 6.21.3
- React Hook Form 7.49.3
- Chart.js 4.4.1
- Zod 3.22.4
- And many more...

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Features Implemented

### ✅ Authentication

- Login page with form validation
- JWT token storage
- Protected routes
- Logout functionality

### ✅ Dashboard Overview

- Metrics cards (Users, Products, Orders, Revenue)
- Sales chart (Chart.js)
- Recent orders table
- Low stock alerts
- Growth indicators

### ✅ User Management

- List all users with pagination
- Search and filter users
- Create/Edit/Delete users
- Role management (Admin, Staff, Customer)
- User verification status

### ✅ Product Management

- List all products with pagination
- Advanced filtering (category, price, stock, rating)
- Create/Edit/Delete products
- Product form with validation
- Stock tracking
- Multiple colors and sizes support

### ✅ Order Management

- List all orders with pagination
- Filter by status
- Order details page
- Update order status
- Payment information
- Shipping address display

### ✅ Review Management

- List all reviews
- Star rating display
- Delete inappropriate reviews
- Product and user information

### ✅ FAQ Management

- List all FAQs
- Create/Edit/Delete FAQs
- Product association

### ✅ Analytics Dashboard

- Revenue charts (Bar, Doughnut)
- Sales by category
- Conversion rate metrics
- Average order value
- Customer retention

### ✅ UI/UX Features

- Dark/Light mode toggle
- Responsive design (mobile, tablet, desktop)
- Collapsible sidebar
- Toast notifications
- Loading skeletons
- Modal dialogs
- Form validation with Zod
- Accessibility features

## Usage Guide

### Login

- Email: `admin@example.com`
- Password: `password123` (any 6+ characters for demo)

### Navigation

- Use the sidebar to navigate between sections
- Click the menu icon to collapse/expand sidebar on mobile
- Toggle dark mode with the moon/sun icon in the header

### User Management

1. Go to "Users" from sidebar
2. Click "Add User" to create new user
3. Use filters to search by role or verification status
4. Click edit icon to modify user details
5. Click delete icon to remove user

### Product Management

1. Go to "Products" from sidebar
2. Click "Add Product" to create new product
3. Fill in product details including name, price, category, colors, sizes
4. Use filters to search products
5. Click "Edit" to modify product

### Order Management

1. Go to "Orders" from sidebar
2. Filter orders by status
3. Click eye icon to view order details
4. Update order status from details page
5. View customer and shipping information

### Reviews & FAQs

- Moderate reviews and delete inappropriate ones
- Create FAQs for products
- Edit or delete existing FAQs

### Analytics

- View comprehensive business metrics
- Track revenue trends
- Monitor sales by category
- Check conversion rates and customer retention

## API Integration

The application is set up with RTK Query for efficient API calls. All API endpoints are defined in `src/store/api/adminApi.ts`.

### Connecting to Your Backend

Update the base URL in `.env`:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### API Endpoints Expected

The dashboard expects the following endpoints:

**Users:**

- `GET /admin/users` - List users
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

**Products:**

- `GET /admin/products` - List products
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

**Orders:**

- `GET /admin/orders` - List orders
- `GET /admin/orders/:id` - Get order details
- `PATCH /admin/orders/:id/status` - Update order status

**Reviews:**

- `GET /admin/reviews` - List reviews
- `DELETE /admin/reviews/:id` - Delete review

**FAQs:**

- `GET /admin/faqs` - List FAQs
- `POST /admin/faqs` - Create FAQ
- `PUT /admin/faqs/:id` - Update FAQ
- `DELETE /admin/faqs/:id` - Delete FAQ

**Analytics:**

- `GET /admin/analytics/dashboard` - Dashboard metrics
- `GET /admin/analytics/sales` - Sales analytics
- `GET /admin/analytics/products` - Product analytics

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Add New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Add New API Endpoints

1. Define endpoint in `src/store/api/adminApi.ts`
2. Export hook for use in components

## Troubleshooting

### Port Already in Use

Change port in `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change this
}
```

### API Connection Issues

- Verify `.env` file exists and has correct API URL
- Check CORS settings on your backend
- Ensure backend is running

### Build Issues

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Connect Real Backend**: Update API base URL and test with your backend
2. **Add File Upload**: Implement image upload for products
3. **Enhance Analytics**: Add more charts and metrics
4. **Email Templates**: Create email notification templates
5. **Export Features**: Add CSV/Excel export functionality
6. **Real-time Updates**: Integrate WebSocket for live updates
7. **Multi-language**: Add i18n support for Bengali/English
8. **Advanced Search**: Integrate Algolia or Elasticsearch

## Support

For issues or questions:

- Check the TypeScript types in `src/types/index.ts`
- Review API definitions in `src/store/api/adminApi.ts`
- Refer to component documentation in source files

## License

MIT License - Feel free to use this dashboard for your projects!
