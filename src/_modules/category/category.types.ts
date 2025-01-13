export interface PublicSubCategory {
  id: number;
  name: string;
  slug: string;
}

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  subCategories: PublicSubCategory[];
}
