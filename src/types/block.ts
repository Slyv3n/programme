export interface Block {
    id: number
    type: string
    content: Record<string, any>
    order: number
    parentId: number | null
    column: string | null
    pageId: number
    createdAt: Date
    updatedAt: Date
}

export interface Page {
    id: number
    name: string
    slug: string
    isPublished: boolean
    createdAt: Date
    updatedAt: Date
    blocks?: Block[]
}