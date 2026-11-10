import { useStore } from '../context/StoreContext';

export function useCart() {
  const { state, dispatch, cartSummary, handleAddToCart } = useStore();
  return {
    cart: state.cart,
    promoCode: state.promoCode,
    ...cartSummary,
    addItem: handleAddToCart,
    removeItem: (index) => dispatch({ type: 'REMOVE_FROM_CART', payload: index }),
    updateItem: (index, updates) =>
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { index, updates } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  };
}
