
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Create a context for the dialog
const DialogContext = createContext();

const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);

  const openDialog = (content, options = {}) => {
    setDialogs(prev => [...prev, { content, id: Math.random().toString(36).substr(2, 9), ...options }]);
  };

  const closeDialog = (id) => {
    setDialogs(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, dialogs }}>
      {children}
      {dialogs.map(dialog => (
        <DialogOverlay key={dialog.id} dialog={dialog} onClose={() => closeDialog(dialog.id)} />
      ))}
    </DialogContext.Provider>
  );
};

// DialogOverlay component to handle the backdrop
const DialogOverlay = ({ dialog, onClose }) => {
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <DialogContent dialog={dialog} onClose={onClose} />
    </div>,
    document.body
  );
};

// Dialog component (wrapper)
const Dialog = ({ open, onOpenChange, children }) => {
  const { openDialog, closeDialog, dialogs } = useContext(DialogContext);
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen && !dialogs.some(d => d.id === 'controlled-dialog')) {
      openDialog(children, { id: 'controlled-dialog' });
    } else if (!isOpen && dialogs.some(d => d.id === 'controlled-dialog')) {
      closeDialog('controlled-dialog');
    }
    if (onOpenChange) onOpenChange(isOpen);
  }, [isOpen, openDialog, closeDialog, children, onOpenChange, dialogs]);

  return null; // Rendered via DialogOverlay
};

// DialogContent component
const DialogContent = ({ dialog, onClose }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, [dialog]);

  return (
    <div
      ref={contentRef}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg"
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
    >
      {dialog.content}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
        aria-label="Close dialog"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};

// DialogHeader component
const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

// DialogTitle component
const DialogTitle = ({ children }) => {
  return <h2 className="text-xl font-bold text-gray-200">{children}</h2>;
};

// DialogDescription component
const DialogDescription = ({ children }) => {
  return <p className="text-gray-400 mb-4">{children}</p>;
};

// Ensure DialogProvider is used at the app root
const DialogRoot = ({ children }) => {
  return <DialogProvider>{children}</DialogProvider>;
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogRoot };
