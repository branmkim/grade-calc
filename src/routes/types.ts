export interface CatType {
    name: string;
    weight: number;
    color: string;
    items: ItemType[];
}
export interface ItemType {
    pts: number;
    total: number;
    star: boolean;
}