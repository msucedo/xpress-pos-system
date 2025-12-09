import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoScroll } from '../useAutoScroll';

describe('useAutoScroll', () => {
  let mockElement;
  let scrollToSpy;

  beforeEach(() => {
    // Mock scrollTo method
    scrollToSpy = vi.fn();
    mockElement = {
      scrollTo: scrollToSpy
    };

    // Mock querySelector
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);
  });

  afterEach(() => {
    // Clean up mocks after each test
    vi.restoreAllMocks();
  });

  it('should not scroll when trigger is false', () => {
    renderHook(() => useAutoScroll(false));

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it('should scroll to top when trigger becomes true', () => {
    const { rerender } = renderHook(
      ({ trigger }) => useAutoScroll(trigger),
      { initialProps: { trigger: false } }
    );

    expect(scrollToSpy).not.toHaveBeenCalled();

    // Change trigger to true
    rerender({ trigger: true });

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });

  it('should use default selector ".promotion-form"', () => {
    renderHook(() => useAutoScroll(true));

    expect(document.querySelector).toHaveBeenCalledWith('.promotion-form');
  });

  it('should use custom selector when provided', () => {
    renderHook(() => useAutoScroll(true, '.custom-selector'));

    expect(document.querySelector).toHaveBeenCalledWith('.custom-selector');
  });

  it('should not throw error when element is not found', () => {
    document.querySelector.mockReturnValue(null);

    expect(() => {
      renderHook(() => useAutoScroll(true));
    }).not.toThrow();
  });

  it('should scroll multiple times when trigger changes from false to true multiple times', () => {
    const { rerender } = renderHook(
      ({ trigger }) => useAutoScroll(trigger),
      { initialProps: { trigger: false } }
    );

    // First trigger
    rerender({ trigger: true });
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // Reset trigger
    rerender({ trigger: false });

    // Second trigger
    rerender({ trigger: true });
    expect(scrollToSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle different selectors on rerender', () => {
    const mockElement2 = { scrollTo: vi.fn() };

    const { rerender } = renderHook(
      ({ trigger, selector }) => useAutoScroll(trigger, selector),
      { initialProps: { trigger: true, selector: '.selector-1' } }
    );

    expect(document.querySelector).toHaveBeenCalledWith('.selector-1');
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // Change selector
    document.querySelector.mockReturnValue(mockElement2);
    rerender({ trigger: true, selector: '.selector-2' });

    expect(document.querySelector).toHaveBeenCalledWith('.selector-2');
    expect(mockElement2.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('should not scroll when element exists but trigger is false', () => {
    renderHook(() => useAutoScroll(false, '.my-element'));

    expect(document.querySelector).not.toHaveBeenCalled();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });
});
