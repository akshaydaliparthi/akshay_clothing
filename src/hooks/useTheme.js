import { useStore } from '../context/StoreContext';

export function useTheme() {
  const { state, dispatch } = useStore();
  return {
    theme: state.theme,
    isDark: state.theme === 'dark',
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setTheme: (t) => dispatch({ type: 'SET_THEME', payload: t }),
  };
}
