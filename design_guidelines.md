# Electronics Retail Management System - Design Guidelines

## Design Approach
**System Selected**: Material Design 3 (Material You)  
**Rationale**: Optimal for data-dense business applications with extensive forms, tables, and transactional workflows. Provides clear patterns for information hierarchy and efficient task completion.

## Core Design Principles
1. **Clarity Over Flash**: Prioritize data legibility and workflow efficiency
2. **Consistent Patterns**: Reusable components across all management modules
3. **Rapid Access**: Minimize clicks to critical actions (POS, order creation, payments)

---

## Typography System

**Font Family**: Inter (via Google Fonts CDN) - exceptional readability for dense data  
**Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

**Hierarchy**:
- Page Titles: `text-2xl font-bold` (Dashboard, Products, Orders)
- Section Headers: `text-xl font-semibold` (within cards/panels)
- Card Titles: `text-lg font-medium`
- Body Text: `text-base font-normal` (table data, form labels)
- Captions: `text-sm font-normal` (timestamps, metadata)
- Small Labels: `text-xs font-medium` (badges, status indicators)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**  
- Component padding: `p-6` standard, `p-8` for major cards
- Section gaps: `gap-6` for grids, `gap-4` for forms
- Page margins: `px-6 py-8` on mobile, `px-8 py-12` on desktop

**Grid Structure**:
- Dashboard: 3-column grid on desktop (`grid-cols-1 md:grid-cols-3`)
- Data tables: Full-width with horizontal scroll on mobile
- Forms: Single column on mobile, 2-column on desktop (`md:grid-cols-2`)
- POS Cart: 2-column layout (product search left, cart right on desktop)

**Max Widths**:
- Main content container: `max-w-7xl mx-auto`
- Forms: `max-w-4xl`
- Modals: `max-w-2xl`

---

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed at top with subtle shadow (`shadow-md`)
- Height: `h-16`
- Logo/brand left, main navigation center, user profile right
- Links: Horizontal, `px-4 py-2`, medium weight text

**Side Navigation** (for larger screens):
- Fixed left sidebar, width `w-64`
- Vertical stack of navigation items with icons (from Heroicons)
- Active state: filled background, bold text
- Sections: Dashboard, Inventory (Products/Brands/Suppliers), Customers, Employees, Orders, POS

### Cards & Panels
**Dashboard Summary Cards**:
- Elevated appearance with `shadow-lg rounded-lg`
- Padding: `p-6`
- Icon at top (48x48), large metric number (`text-3xl font-bold`), label below (`text-sm`)
- Grid layout: 3 columns on desktop

**Data Display Cards**:
- White background, `shadow rounded-lg`
- Header with title and action button, content area with `p-6`

### Tables
**Data Tables** (Products, Customers, Orders):
- Striped rows for readability
- Fixed header row with `bg-gray-50 text-xs font-semibold uppercase tracking-wide`
- Cell padding: `px-6 py-4`
- Hover state on rows
- Action buttons (Edit/Delete) in last column as icon buttons
- Responsive: Horizontal scroll on mobile with minimum column widths

### Forms
**Form Layout**:
- Labels above inputs, `text-sm font-medium mb-2`
- Input fields: `border rounded-lg px-4 py-2.5`, height `h-11`
- Dropdowns: Same styling as text inputs with chevron icon
- Required fields: Red asterisk next to label
- Error messages: `text-sm text-red-600 mt-1`
- Form actions: Right-aligned, primary + secondary button

**POS Cart Interface**:
- Product search: Autocomplete dropdown with product images (thumbnails), name, price
- Cart display: Table format with product, quantity controls (+/-), price, subtotal, remove button
- Cart total: Large, prominent (`text-2xl font-bold`)
- "Create Order" button: Full-width, primary, large (`py-4`)

### Buttons
**Hierarchy**:
- Primary: Filled, high-emphasis actions (Save, Create Order, Add Payment)
- Secondary: Outlined, medium-emphasis (Cancel, Back)
- Tertiary/Icon: Text or icon-only, low-emphasis (Edit, Delete in tables)

**Sizing**:
- Default: `px-6 py-2.5 rounded-lg text-base font-medium`
- Large (POS actions): `px-8 py-4 text-lg`
- Icon buttons: `p-2 rounded-lg` with 20x20 icons

### Status Indicators
**Badges**:
- Stock levels: Green (In Stock), Yellow (Low Stock <10), Red (Out of Stock)
- Payment status: Green (Paid), Orange (Partial), Red (Unpaid)
- Styling: `px-3 py-1 rounded-full text-xs font-semibold`

### Modals
**Dialog Structure**:
- Overlay with `backdrop-blur-sm`
- Modal card: `rounded-xl shadow-2xl max-w-2xl`
- Header with title and close button, content area, footer with actions
- Padding: `p-6`

---

## Page-Specific Layouts

### Dashboard
- 3-column summary cards at top (Total Products, Total Customers, Total Orders)
- "Customer Spending Lookup" tool: Input field + button, result display card below
- Recent orders table (limited to 10 rows)

### Products/Customers/Employees Pages
- Page header with title and "Add New" button (top-right)
- Search/filter bar below header
- Data table with full CRUD actions
- Add/Edit forms in modal dialogs

### Point of Sale (POS)
- Full-screen layout (no sidebar for focus)
- Header with customer selector (prominent, top)
- 2-column layout: Left 60% product search/browse, Right 40% cart
- Cart sticky on scroll with fixed total and action button at bottom

### Order Details Page
- Order header: Order ID, date, customer info in card
- Order items table with product details
- Payment summary card: Total amount, paid amount, balance (large numbers)
- "Add Payment" form below (always visible, not collapsed)

---

## Icons
**Library**: Heroicons (outline for default, solid for filled states)  
**Usage**: 20x20 for inline, 24x24 for buttons, 48x48 for dashboard cards

**Key Icons**:
- Dashboard: ChartBarIcon
- Products: CubeIcon
- Customers: UsersIcon
- Orders: ShoppingCartIcon
- Payments: CreditCardIcon
- POS: CalculatorIcon

---

## Responsive Behavior
- Mobile (<768px): Single column, stacked navigation drawer, horizontal scroll tables
- Tablet (768-1024px): 2-column grids, visible sidebar
- Desktop (>1024px): Full multi-column layouts, fixed sidebar navigation

---

## Animation & Transitions
**Minimal Use**:
- Smooth transitions on hover states: `transition-colors duration-200`
- Modal appearance: Fade in with `transition-opacity duration-300`
- No page transitions, no scroll animations

---

## Images
**No hero images needed** - this is an enterprise management system.  
**Product thumbnails**: 48x48 in cart, 64x64 in product tables (placeholder boxes with product initials if no image)