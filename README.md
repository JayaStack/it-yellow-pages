# Business Directory Clone (MERN)

A simple business directory and yellow pages clone. Users can find local services by category or location, and business owners can submit listings for review.

I built this to practice handling multi-level categories (Category -> SubCategory) and setting up a basic admin moderation flow in a MERN environment.

## Key Features
- **Search & Discovery**: Filter businesses by keyword, location, and specific industry categories.
- **Listing Workflow**: Owners can submit business details; listings remain "pending" until an admin approves them.
- **Admin Panel**: Protected dashboard to moderate listings and toggle "Featured" status for businesses.
- **Auth**: Basic JWT authentication for users and role-based protection for the admin area.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB.
- **Libraries**: Axios for API calls, Mongoose for modeling, and Bcrypt for security.

## Setup & Running

### 1. Database Configuration
Rename or create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=secret_key
NODE_ENV=development
```

### 2. Installation
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Data Seeding
To see the app in action with realistic data, run these in the `/server` directory:
1. `node utils/seed.js` - Sets up the admin and main categories.
2. `node seed/seedSubCategories.js` - Adds industry-specific subcategories.
3. `node seed/seedCategoryBusinesses.js` - Populates the site with sample listings.

### 4. Start Development
- **Backend**: `node server.js` (inside /server)
- **Frontend**: `npm run dev` (inside /client)

## Credentials
- **Admin**: admin@example.com / password123
- **Listing Owner**: Register via the signup page.
