// Base Interface for Demos
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
}

// Partial<T> - Makes all properties optional
type PartialProduct = Partial<Product>;

function updateProduct(product: Product, updates: PartialProduct): Product {
    return { ...product, ...updates };
}

// Required<T> - Makes all properties required
interface OptionalProduct {
    id?: number;
    name?: string;
    price?: number;
}

type RequiredProduct = Required<OptionalProduct>;

// Readonly<T> - Makes all properties readonly
type ReadonlyProduct = Readonly<Product>;

// Pick<T, K> - Creates a type by picking properties from T
type ProductPreview = Pick<Product, 'id' | 'name' | 'price'>;

function displayPreview(product: ProductPreview): string {
    return `${product.name} - £${product.price}`;
}

// Omit<T, K> - Creates a type by omitting properties from T
type ProductWithoutId = Omit<Product, 'id'>;

function createProduct(product: ProductWithoutId): Product {
    return { id: Math.floor(Math.random() * 1000), ...product };
}

// Record<K, T> - Constructs an object type with keys K of type T
type ProductCategory = 'electronics' | 'clothing' | 'food';
type CategoryStock = Record<ProductCategory, number>;

const inventory: CategoryStock = {
    electronics: 150,
    clothing: 200,
    food: 75,
};

// Exclude<T, U> - Excludes types from T that are assignable to U
type AllStatuses = 'pending' | 'approved' | 'rejected' | 'cancelled';
type ActiveStatuses = Exclude<AllStatuses, 'cancelled' | 'rejected'>;

function processActiveStatus(status: ActiveStatuses): string {
    return `Processing ${status} status`;
}

// Extract<T, U> - Extracts types from T that are assignable to U
type AllEvents = 'click' | 'scroll' | 'keydown' | 'mouseenter' | 'mouseleave';
type MouseEvents = Extract<AllEvents, `mouse${string}`>;

// NonNullable<T> - Excludes null and undefined from T
type NullableString = string | null | undefined;
type SafeString = NonNullable<NullableString>;

function processString(value: SafeString): string {
    return value.toUpperCase();
}

// ReturnType<T> - Obtains the return type of a function
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}

type CalculateResult = ReturnType<typeof calculateTotal>;

// Parameters<T> - Obtains the parameters of a function type as a tuple
type CalculateParams = Parameters<typeof calculateTotal>;

function logCalculation(...params: CalculateParams): void {
    console.log(`Calculating: ${params[0]} × ${params[1]}`);
}

// InstanceType<T> - Obtains the instance type of a constructor function
class User {
    constructor(
        public name: string,
        public email: string,
    ) {}
}

type UserInstance = InstanceType<typeof User>;

function greetUser(user: UserInstance): string {
    return `Hello, ${user.name}!`;
}

// Awaited<T> - Unwraps the type of a Promise
type FetchResult = Promise<{ data: string; status: number }>;
type UnwrappedResult = Awaited<FetchResult>;

async function processResult(): Promise<UnwrappedResult> {
    return { data: 'Success', status: 200 };
}

// Combination of Utility Types
type ProductUpdate = Partial<Omit<Product, 'id'>>;
type ReadonlyProductPreview = Readonly<Pick<Product, 'name' | 'price'>>;

function applyDiscount(product: ReadonlyProductPreview, discount: number): number {
    return product.price * (1 - discount);
}

// Partial<T>
console.log('=== Partial<T> ===');
const product: Product = {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    description: 'High performance laptop',
    inStock: true,
};
const updated = updateProduct(product, { price: 899.99, inStock: false });
console.log(`Updated product: ${updated.name} - £${updated.price} (In stock: ${updated.inStock})`);

// Required<T>
console.log('\n=== Required<T> ===');
const requiredProduct: RequiredProduct = {
    id: 2,
    name: 'Phone',
    price: 699.99,
};
console.log(`Required product: ${JSON.stringify(requiredProduct)}`);

// Readonly<T>
console.log('\n=== Readonly<T> ===');
const readonlyProduct: ReadonlyProduct = { ...product };
console.log(`Readonly product: ${readonlyProduct.name}`);

// Pick<T, K>
console.log('\n=== Pick<T, K> ===');
const preview: ProductPreview = { id: 3, name: 'Tablet', price: 499.99 };
console.log(displayPreview(preview));

// Omit<T, K>
console.log('\n=== Omit<T, K> ===');
const newProduct = createProduct({
    name: 'Headphones',
    price: 149.99,
    description: 'Noise-cancelling headphones',
    inStock: true,
});
console.log(`Created product ID: ${newProduct.id}`);

// Record<K, T>
console.log('\n=== Record<K, T> ===');
console.log(`Electronics stock: ${inventory.electronics}`);
console.log(`Clothing stock: ${inventory.clothing}`);
console.log(`Food stock: ${inventory.food}`);

// Exclude<T, U>
console.log('\n=== Exclude<T, U> ===');
console.log(processActiveStatus('pending'));
console.log(processActiveStatus('approved'));

// Extract<T, U>
console.log('\n=== Extract<T, U> ===');
const mouseEvent: MouseEvents = 'mouseenter';
console.log(`Mouse event: ${mouseEvent}`);

// NonNullable<T>
console.log('\n=== NonNullable<T> ===');
const safeValue: SafeString = 'TypeScript';
console.log(processString(safeValue));

// ReturnType<T> & Parameters<T>
console.log('\n=== ReturnType<T> & Parameters<T> ===');
const result: CalculateResult = calculateTotal(29.99, 3);
console.log(`Result: ${result}`);
logCalculation(19.99, 5);

// InstanceType<T>
console.log('\n=== InstanceType<T> ===');
const user = new User('Alice', 'alice@example.com');
console.log(greetUser(user));

// Awaited<T>
console.log('\n=== Awaited<T> ===');
processResult().then((res) => {
    console.log(`Async result: ${res.data}, Status: ${res.status}`);
});

// Combined Utility Types
console.log('\n=== Combined Utility Types ===');
const productForUpdate: ProductUpdate = { price: 799.99 };
console.log(`Update data: ${JSON.stringify(productForUpdate)}`);

const previewForDiscount: ReadonlyProductPreview = { name: 'Monitor', price: 299.99 };
const discountedPrice = applyDiscount(previewForDiscount, 0.15);
console.log(`${previewForDiscount.name} after 15% discount: £${discountedPrice.toFixed(2)}`);
