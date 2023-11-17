export interface MenuItemModel {
    title: string
    path: string  
    icon?: string  
}

export interface MenuSubModel {
    title: string
    path: string  
    icon?: string 
    children?: MenuItemModel[] 
}

export interface MenuModel {
    title: string
    path: string
    icon?: string
    children?: MenuSubModel[]
}