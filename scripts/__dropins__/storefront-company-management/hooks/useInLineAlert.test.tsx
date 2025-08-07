/********************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 *******************************************************************/

import { renderHook, act } from '@adobe-commerce/elsie/lib/tests';
import { useInLineAlert } from './useInLineAlert';

// Mock timers
jest.useFakeTimers();

// Mock the icons
const MockCheckWithCircle = () => 'Success Icon';
const MockWarning = () => 'Warning Icon';
const MockWarningWithCircle = () => 'Error Icon';

jest.mock('@adobe-commerce/elsie/icons', () => ({
  CheckWithCircle: MockCheckWithCircle,
  Warning: MockWarning,
  WarningWithCircle: MockWarningWithCircle,
}));

describe('useInLineAlert', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with empty alert props', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    expect(result.current.inLineAlertProps).toEqual({});
  });

  it('should set success alert', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showSuccess('Success message');
    });
    
    expect(result.current.inLineAlertProps).toEqual({
      type: 'success',
      text: 'Success message',
      icon: expect.any(Object),
    });
  });

  it('should set warning alert', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showWarning('Warning message');
    });
    
    expect(result.current.inLineAlertProps).toEqual({
      type: 'warning',
      text: 'Warning message',
      icon: expect.any(Object),
    });
  });

  it('should set error alert', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showError('Error message');
    });
    
    expect(result.current.inLineAlertProps).toEqual({
      type: 'error',
      text: 'Error message',
      icon: expect.any(Object),
    });
  });

  it('should clear alert manually', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showError('Error message');
    });
    
    expect(result.current.inLineAlertProps.type).toBe('error');
    
    act(() => {
      result.current.clearAlert();
    });
    
    expect(result.current.inLineAlertProps).toEqual({});
  });

  it('should clear alert when called with no parameters', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showError('Error message');
    });
    
    expect(result.current.inLineAlertProps.type).toBe('error');
    
    act(() => {
      result.current.handleSetInLineAlert();
    });
    
    expect(result.current.inLineAlertProps).toEqual({});
  });

  it('should auto-hide success alerts by default', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showSuccess('Success message');
    });
    
    expect(result.current.inLineAlertProps.type).toBe('success');
    
    // Fast-forward time by 3 seconds (default success auto-hide delay)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(result.current.inLineAlertProps).toEqual({});
  });

  it('should not auto-hide warning alerts by default', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showWarning('Warning message');
    });
    
    expect(result.current.inLineAlertProps.type).toBe('warning');
    
    // Fast-forward time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Warning should still be visible (autoHide is false by default)
    expect(result.current.inLineAlertProps.type).toBe('warning');
  });

  it('should not auto-hide error alerts by default', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showError('Error message');
    });
    
    expect(result.current.inLineAlertProps.type).toBe('error');
    
    // Fast-forward time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Error should still be visible (autoHide is false by default)
    expect(result.current.inLineAlertProps.type).toBe('error');
  });

  it('should respect custom auto-hide settings', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.handleSetInLineAlert({
        type: 'error',
        text: 'Error message',
        autoHide: true,
        autoHideDelay: 1000,
      });
    });
    
    expect(result.current.inLineAlertProps.type).toBe('error');
    
    // Fast-forward time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.inLineAlertProps).toEqual({});
  });

  it('should clear existing timer when setting new alert', () => {
    const { result } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showSuccess('First message');
    });
    
    // Fast-forward time by 1 second (not enough to auto-hide)
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.inLineAlertProps.text).toBe('First message');
    
    // Set new alert before first one auto-hides
    act(() => {
      result.current.showSuccess('Second message');
    });
    
    expect(result.current.inLineAlertProps.text).toBe('Second message');
    
    // Fast-forward original timer duration
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // First timer should have been cleared, second message should still be there
    expect(result.current.inLineAlertProps.text).toBe('Second message');
    
    // Fast-forward second timer duration
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Now second message should be cleared
    expect(result.current.inLineAlertProps).toEqual({});
  });

  it('should cleanup timer on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    const { result, unmount } = renderHook(() => useInLineAlert());
    
    act(() => {
      result.current.showSuccess('Success message');
    });
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});
