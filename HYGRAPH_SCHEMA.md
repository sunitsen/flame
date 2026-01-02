# Hygraph Schema Definition

This document describes the GraphQL schema for the Food Ordering App in Hygraph.

## Models

### Category

```graphql
model Category {
  id            ID!      @id @default(uuid())
  name          String!
  slug          String!  @unique
  description   String?
  image         Asset?   @relation("CategoryImage")
  displayOrder  Int      @default(0)
  isActive      Boolean  @default(true)
  menuItems     MenuItem[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### MenuItem

```graphql
model MenuItem {
  id            ID!         @id @default(uuid())
  name          String!
  slug          String!     @unique
  description   String?
  images        Asset[]     @relation("MenuItemImages")
  category      Category!   @relation(fields: [categoryId], references: [id])
  categoryId    ID!
  basePrice     Float!
  nutrition     Nutrition   @relation(fields: [nutritionId], references: [id])
  nutritionId   ID!
  ingredients   String[]
  allergens     String[]
  isSpicy       Boolean     @default(false)
  isHalal       Boolean     @default(false)
  isVegetarian  Boolean     @default(false)
  isVegan       Boolean     @default(false)
  isAvailable   Boolean     @default(true)
  isFeatured    Boolean     @default(false)
  sizes         Size[]
  addOns        AddOn[]
  spiceLevels   SpiceLevel[]
  displayOrder  Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

### Nutrition

```graphql
model Nutrition {
  id        ID!      @id @default(uuid())
  calories  Int!
  protein   Float!
  carbs     Float!
  fat       Float!
  fiber     Float?
  sugar     Float?
  sodium    Float?
  menuItem  MenuItem
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Size

```graphql
model Size {
  id              ID!       @id @default(uuid())
  name            String!
  priceModifier   Float     @default(0)
  calorieModifier Int       @default(0)
  menuItem        MenuItem? @relation(fields: [menuItemId], references: [id])
  menuItemId      ID?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### AddOn

```graphql
model AddOn {
  id              ID!       @id @default(uuid())
  name            String!
  description     String?
  price           Float!
  calorieModifier Int      @default(0)
  category        AddOnCategory @default(EXTRA)
  isAvailable     Boolean  @default(true)
  menuItem        MenuItem? @relation(fields: [menuItemId], references: [id])
  menuItemId      ID?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum AddOnCategory {
  TOPPING
  SAUCE
  EXTRA
  SIDE
}
```

### SpiceLevel

```graphql
model SpiceLevel {
  id          ID!       @id @default(uuid())
  name        String!
  level       Int!      # 0-5 scale
  description String?
  menuItem    MenuItem? @relation(fields: [menuItemId], references: [id])
  menuItemId  ID?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Promotion

```graphql
model Promotion {
  id              ID!            @id @default(uuid())
  code            String!        @unique
  name            String!
  description     String?
  discountType    DiscountType!
  discountValue   Float!
  minOrderAmount  Float?
  maxDiscountAmount Float?
  validFrom       DateTime!
  validUntil      DateTime!
  isActive        Boolean        @default(true)
  usageLimit      Int?
  usedCount       Int            @default(0)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

enum DiscountType {
  PERCENTAGE
  FIXED
}
```

### Asset (Hygraph Built-in)

The Asset model is provided by Hygraph for image/file storage.

## Relationships

- `Category` → `MenuItem[]` (one-to-many)
- `MenuItem` → `Category` (many-to-one)
- `MenuItem` → `Nutrition` (one-to-one)
- `MenuItem` → `Size[]` (one-to-many)
- `MenuItem` → `AddOn[]` (one-to-many)
- `MenuItem` → `SpiceLevel[]` (one-to-many)
- `Category` → `Asset` (one-to-one, optional)
- `MenuItem` → `Asset[]` (one-to-many)

## API Permissions

Configure in Hygraph:
- **Public Content API**: Read-only access for menu items, categories, promotions
- **Management API**: Full access for admin operations (requires token)

## Example Queries

### Get Categories

```graphql
query GetCategories {
  categories(where: { isActive: true }, orderBy: displayOrder_ASC) {
    id
    name
    slug
    description
    image {
      url
    }
  }
}
```

### Get Menu Items

```graphql
query GetMenuItems {
  menuItems(where: { isAvailable: true }, orderBy: displayOrder_ASC) {
    id
    name
    slug
    description
    basePrice
    nutrition {
      calories
      protein
      carbs
      fat
    }
    category {
      name
    }
    sizes {
      name
      priceModifier
      calorieModifier
    }
    addOns {
      name
      price
      calorieModifier
    }
  }
}
```

## Setup in Hygraph

1. Create a new project in Hygraph
2. Add all models defined above
3. Set up relationships between models
4. Configure API permissions
5. Add sample data
6. Copy your endpoint URL and token

