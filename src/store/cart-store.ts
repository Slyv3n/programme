import { ProductWithRelations } from "@/lib/prisma-types";
import { isHappyHour } from "@/lib/utils";
import { IngredientSelection, PromoCode, SelectedOptions } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./user-store";

const BAG_PRICE = 0.15;
const MAX_ITEM_QUANTITY = 10;

export interface CartItem {
    cartItemId: string;
    product: ProductWithRelations;
    quantity: number;
    selectedIngredients: IngredientSelection;
    selectedOptions: SelectedOptions;
    totalPrice: number;
}

interface CartState {
    items: CartItem[];
    appliedCode: PromoCode | null;
    hasBag: boolean;
    orderType: 'sur-place' | 'a-emporter' | null;
    setOrderType: (type: 'sur-place' | 'a-emporter') => void;

    addItem: (product: ProductWithRelations, selectedOptions?: SelectedOptions, selectedIngredients?: IngredientSelection) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    toggleBag: () => void;

    subtotal: () => number;
    discount: () => number;
    grandTotal: () => number;

    applyPromoCode: (code: string) => Promise<boolean>;
    removePromoCode: () => void;

    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const generateCartItemId = (productId: number, options: SelectedOptions, ingredients: IngredientSelection): string => {
    const optionsString = Object.values(options || {})
        .flat()
        .map(opt => {
            const subOptionString = opt.selectedSubOption ? `_${opt.selectedSubOption.id}` : '';
            return `${opt.option.id}${subOptionString}_${opt.quantity}`;
        })
        .sort()
        .join('-');

    const ingredientsString = Object.entries(ingredients || {})
        .map(([id, status]) => `${id}_${status}`)
        .sort()
        .join('-');

    return `${productId}-${optionsString}-${ingredientsString}`;
};

const calculateItemPrice = (product: ProductWithRelations, options: SelectedOptions, ingredients: IngredientSelection): number => {
    const isCurrentlyHappyHour = isHappyHour();
    let basePrice = 0;

    if (product.pointCost && product.pointCost > 0) {
        basePrice = 0;
    } else {
        basePrice = isCurrentlyHappyHour && typeof product.happyHourPrice === 'number'
            ? product.happyHourPrice
            : product.price
        ;
    }
    const optionsPrice = Object.values(options || {}).flat().reduce((total, opt) => total + (opt.option.priceModifier || 0) * opt.quantity, 0);

    let ingredientsPrice = 0;
    product.ingredientGroups?.forEach(group => {
        group.items.forEach(ingredient => {
            if (ingredients[ingredient.id] === 'added' && ingredient.addPrice) {
                ingredientsPrice += ingredient.addPrice;
            }
        });
    });

    return basePrice + optionsPrice + ingredientsPrice;
};

export const useCartStore = create<CartState>() (
    persist(
        (set, get) => ({
            items: [],
            appliedCode: null,
            hasBag: false,
            _hasHydrated: false,
            orderType: null,
            setOrderType: (type) => set({ orderType: type }),

            setHasHydrated: (state) => {
                set({ _hasHydrated: state });
            },

            addItem: (product, selectedOptions = {}, selectedIngredients = {}) => {
                if (product.pointCost && product.pointCost > 0) {
                    const currentUser = useUserStore.getState().user;
                    const totalPointsInCart = get().items
                        .filter(item => item.product.pointCost)
                        .reduce((sum, item) => sum + (item.product.pointCost! * item.quantity), 0);

                    if (!currentUser || currentUser.points < totalPointsInCart + product.pointCost) {
                        alert("Solde de points insuffisant !");
                        return;
                    }
                }
                const cartItemId = generateCartItemId(product.id, selectedOptions, selectedIngredients);
                const totalPrice = calculateItemPrice(product, selectedOptions, selectedIngredients);

                set((state) => {
                    const existingItem = state.items.find(item => item.cartItemId === cartItemId);
                    if (existingItem) {
                        const updatedItems = state.items.map(item =>
                            item.cartItemId === cartItemId
                                ? { ...item, quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY) }
                                : item
                        );
                        return { items: updatedItems };
                    } else {
                        const newItem: CartItem = {
                            cartItemId,
                            product,
                            quantity: 1,
                            selectedOptions,
                            selectedIngredients,
                            totalPrice,
                        };
                        return { items: [...state.items, newItem] };
                    }
                });
            },

            removeItem: (cartItemId) => set((state) => ({
                items: state.items.filter((item) => item.cartItemId !== cartItemId),
            })),

            updateQuantity: (cartItemId, quantity) => set((state) => ({
                items: state.items
                    .map((item) =>
                        item.cartItemId === cartItemId
                            ? { ...item, quantity: Math.min(quantity, MAX_ITEM_QUANTITY) }
                            : item
                    )
                    .filter((item) => item.quantity > 0),
            })),

            clearCart: () => set({
                items: [],
                appliedCode: null,
                hasBag: false,
                orderType: null
            }),

            toggleBag: () => set((state) => ({ hasBag: !state.hasBag })),

            subtotal: () => {
                return get().items.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
            },

            discount: () => {
                const sub = get().subtotal();
                const code = get().appliedCode;
                if (!code) return 0;
                if (code.discountType === 'percentage') return (sub * code.value) / 100;
                if (code.discountType === 'fixed') return Math.min(code.value, sub);
                return 0;
            },

            grandTotal: () => {
                const bagPrice = get().hasBag ? BAG_PRICE : 0;
                return get().subtotal() - get().discount() + bagPrice;
            },

            applyPromoCode: async (code) => {
                try {
                    const res = await fetch(`/api/promo-codes/${code}`);
                    if (!res.ok) throw new Error('Code invalide');
                    const promoCodeData: PromoCode = await res.json();
                    set({ appliedCode: promoCodeData });
                    return true;
                } catch {
                    get().removePromoCode();
                    return false;
                }
            },

            removePromoCode: () => set({ appliedCode: null }),
        }),
        {
            name: 'kiosk-cart-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);