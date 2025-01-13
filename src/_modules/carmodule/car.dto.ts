export class CarDto {
  readonly name: string;
  readonly description: string;
  readonly slug: string;
  readonly image?: string;
  readonly pricePerHour: number;
  readonly pricePerMile: number;
  readonly model: string;
  readonly year: number;
  readonly make: string;
  readonly seatingCapacity: number;
  readonly isActive: boolean;
  readonly hasChildSeat: boolean;
  readonly hasWifi: boolean;
  readonly luggageCapacity: number;
  readonly mileagePerGallon: number;
  readonly transmission: string;
  readonly fuelType: string;
  readonly features?: string[];
  readonly isAvailable: boolean;
  readonly categoryId: number;
  readonly subCategoryId?: number;
}
