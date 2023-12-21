export interface CatType {
    name: string;
    color: string;
    id: number;
    weight: number;
    items: ItemType[];
}
export interface ItemType {
    id: number;
    pts: number;
    total: number;
    star: boolean;
}