export function capitalExists() {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('capital');
  }

  return false;
}
