export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  marketplace: "amazon" | "shopee" | "mercado livre";
  amountSold: number;
  amountAvailable: number;
  sellerName: string;
  productCode: string;
  condition: "new" | "used";
  shipping: "prime" | "normal" | "flex" | "full" | "express";
  amountVisitsLastMonth: number;
  amountReviews: number;
  createdAt: string;
  updatedAt: string;
}
