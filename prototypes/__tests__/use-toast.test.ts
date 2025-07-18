import { renderHook, act } from '@testing-library/react';
import { useToast } from '../use-toast';

describe('useToast', () => {
  it('should initialize and show toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.show('Test message');
    });
    expect(result.current.isVisible).toBe(true);
  });
});
