export interface BundleOffer {
    quantity: number
    price: number
    title?: string
}

export interface BundleItem {
    color?: string
    size?: string
    colorHex?: string
    image?: string
}

export interface SelectedBundle {
    offer: BundleOffer
    items: BundleItem[]
}
