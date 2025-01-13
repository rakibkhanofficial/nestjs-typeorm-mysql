export class ProductDto {
  readonly name: string;
  readonly description: string;
  readonly slug: string;
  readonly prodimage?: string;
  readonly price: number;
  readonly offerprice: number;
  readonly packsize: string;
  readonly sku?: string;
  readonly stockQuantity: number;
  readonly brand?: string;
  readonly categoryId: number; // Changed from category string to categoryId number
  readonly subCategoryId?: number; // New field for subcategory
  readonly tags?: string[];
  readonly isActive: boolean;
  readonly weight?: number;
  readonly dimensions?: { length: number; width: number; height: number };
  readonly allergens?: string[];
  readonly expirationDate?: Date;
  readonly barcode?: string;
  readonly nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
