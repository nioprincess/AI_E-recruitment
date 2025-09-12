
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Create a context for the tooltip
const TooltipContext = createContext();

// TooltipProvider component to manage tooltip state
const TooltipProvider = ({ children }) => {
  const [tooltip, setTooltip] = useState(null);

  const showTooltip = (content, triggerRect, id) => {
    setTooltip({ content, triggerRect, id });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip, tooltip }}>
      {children}
    </TooltipContext.Provider>
  );
};

// Tooltip component (wrapper for trigger and content)
const Tooltip = ({ children }) => {
  return <>{children}</>;
};

// TooltipTrigger component
const TooltipTrigger = ({ children, asChild, ...props }) => {
  const { showTooltip, hideTooltip, tooltip } = useContext(TooltipContext);
  const triggerRef = useRef(null);
  const [triggerId] = useState(`tooltip-trigger-${Math.random().toString(36).slice(2)}`);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      showTooltip(null, rect, triggerId);
    }
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      showTooltip(null, rect, triggerId);
    }
  };

  const handleBlur = () => {
    hideTooltip();
  };

  // Clone the child element to add event handlers
  const child = React.Children.only(children);
  return React.cloneElement(
    asChild ? child : <span>{child}</span>,
    {
      ref: triggerRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      'aria-describedby': tooltip && tooltip.id === triggerId ? 'tooltip-content' : undefined,
      ...props,
    }
  );
};

// TooltipContent component
const TooltipContent = ({ children, side = 'top', align = 'center', ...props }) => {
  const { tooltip, hideTooltip } = useContext(TooltipContext);
  const contentRef = useRef(null);

  // Only render if this tooltip is active
  if (!tooltip || tooltip.id !== contentRef.current?.dataset.tooltipId) {
    return null;
  }

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.dataset.tooltipId = tooltip.id;
    }
  }, [tooltip]);

  // Calculate position
  const calculatePosition = () => {
    if (!tooltip?.triggerRect) return { top: 0, left: 0 };

    const { triggerRect } = tooltip;
    const contentRect = contentRef.current?.getBoundingClientRect() || { width: 0, height: 0 };

    let top, left;

    switch (side) {
      case 'top':
        top = triggerRect.top - contentRect.height - 8;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        if (align === 'start') left = triggerRect.left;
        if (align === 'end') left = triggerRect.right - contentRect.width;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        if (align === 'start') left = triggerRect.left;
        if (align === 'end') left = triggerRect.right - contentRect.width;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left - contentRect.width - 8;
        if (align === 'start') top = triggerRect.top;
        if (align === 'end') top = triggerRect.bottom - contentRect.height;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + 8;
        if (align === 'start') top = triggerRect.top;
        if (align === 'end') top = triggerRect.bottom - contentRect.height;
        break;
      default:
        top = triggerRect.top - contentRect.height - 8;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    }

    // Adjust for viewport boundaries
    const viewportPadding = 8;
    const maxLeft = window.innerWidth - contentRect.width - viewportPadding;
    const maxTop = window.innerHeight - contentRect.height - viewportPadding;

    return {
      top: Math.max(viewportPadding, Math.min(top, maxTop)),
      left: Math.max(viewportPadding, Math.min(left, maxLeft)),
    };
  };

  const { top, left } = calculatePosition();

  return createPortal(
    <div
      ref={contentRef}
      id="tooltip-content"
      role="tooltip"
      className="fixed z-50 px-3 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-sm rounded-md shadow-lg max-w-xs animate-fade-in"
      style={{ top: `${top}px`, left: `${left}px` }}
      onMouseEnter={() => {
        // Prevent tooltip from closing when hovering over it
      }}
      onMouseLeave={hideTooltip}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
};

// Animation for fade-in effect
const style = `
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
`;

// Inject styles into the document
const injectStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
};

if (typeof window !== 'undefined') {
  injectStyles();
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
