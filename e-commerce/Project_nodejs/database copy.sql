-- =====================================
-- CREATE DATABASE
-- =====================================
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- =====================================
-- USERS
-- =====================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    password TEXT NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- ROLES
-- =====================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- PERMISSIONS
-- =====================================
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- USER ROLES
-- =====================================
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    roleId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (roleId)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

-- =====================================
-- ROLE PERMISSIONS
-- =====================================
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roleId INT NOT NULL,
    permissionId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (roleId)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    FOREIGN KEY (permissionId)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

-- =====================================
-- CUSTOMERS
-- =====================================
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    password TEXT,
    phone VARCHAR(20),
    image VARCHAR(250),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- CATEGORIES
-- =====================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- BRANDS
-- =====================================
CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- PRODUCTS
-- =====================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoryId INT,
    brandId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (categoryId)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    FOREIGN KEY (brandId)
        REFERENCES brands(id)
        ON DELETE SET NULL
);

-- =====================================
-- ORDERS (ONLINE)
-- =====================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT,
    status VARCHAR(50) DEFAULT 'pending',
    totalAmount DECIMAL(10,2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customerId)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

-- =====================================
-- ORDER ITEMS
-- =====================================
CREATE TABLE orderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    productId INT,
    quantity INT,
    price DECIMAL(10,2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (orderId)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (productId)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =====================================
-- POS SALES
-- =====================================
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoiceId VARCHAR(50),
    totalAmount DECIMAL(10,2),
    tax DECIMAL(10,2),
    paymentMethod VARCHAR(50),
    userId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =====================================
-- SALE ITEMS
-- =====================================
CREATE TABLE saleItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saleId INT,
    productId INT,
    quantity INT,
    price DECIMAL(10,2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (saleId)
        REFERENCES sales(id)
        ON DELETE CASCADE,

    FOREIGN KEY (productId)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =====================================
-- PAYMENTS (FOR SALE AND ORDER)
-- =====================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saleId INT NULL,      -- link to POS sale
    orderId INT NULL,     -- link to online order
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50),
    status VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (saleId)
        REFERENCES sales(id)
        ON DELETE CASCADE,

    FOREIGN KEY (orderId)
        REFERENCES orders(id)
        ON DELETE CASCADE
);


# USERS
npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:text,status:boolean

# ROLES
npx sequelize-cli model:generate --name Role --attributes name:string,description:string

# PERMISSIONS
npx sequelize-cli model:generate --name Permission --attributes name:string,description:string

# USER_ROLES (junction table)
npx sequelize-cli model:generate --name UserRole --attributes userId:integer,roleId:integer

# ROLE_PERMISSIONS (junction table)
npx sequelize-cli model:generate --name RolePermission --attributes roleId:integer,permissionId:integer

# CUSTOMERS
npx sequelize-cli model:generate --name Customer --attributes name:string,email:string,password:text,phone:string,image:string

# CATEGORIES
npx sequelize-cli model:generate --name Category --attributes name:string,description:text,status:boolean

# BRANDS
npx sequelize-cli model:generate --name Brand --attributes name:string,description:text,status:boolean

# PRODUCTS
npx sequelize-cli model:generate --name Product --attributes name:string,description:text,price:decimal,stock:integer,categoryId:integer,brandId:integer

# ORDERS
npx sequelize-cli model:generate --name Order --attributes customerId:integer,status:string,totalAmount:decimal

# ORDER ITEMS
npx sequelize-cli model:generate --name OrderItem --attributes orderId:integer,productId:integer,quantity:integer,price:decimal

# SALES
npx sequelize-cli model:generate --name Sale --attributes invoiceId:string,totalAmount:decimal,tax:decimal,paymentMethod:string,userId:integer

# SALE ITEMS
npx sequelize-cli model:generate --name SaleItem --attributes saleId:integer,productId:integer,quantity:integer,price:decimal

# PAYMENTS
npx sequelize-cli model:generate --name Payment --attributes saleId:integer,orderId:integer,amount:decimal,method:string,status:string