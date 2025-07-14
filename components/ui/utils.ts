import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function for robust clipboard copying with multiple fallback methods
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    return false;
  }

  // Method 1: Try modern clipboard API (works in secure contexts)
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Suppress the specific permissions error that's expected in some environments
    if (error instanceof Error && error.message.includes('permissions policy')) {
      console.info('Clipboard API blocked by permissions policy, using fallback methods');
    } else {
      console.warn('Clipboard API failed:', error);
    }
    // Continue to fallback methods
  }

  // Method 2: Try document.execCommand (older browsers/contexts)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('tabindex', '-1');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return true;
    }
  } catch (error) {
    console.warn('execCommand copy failed:', error);
  }

  // Method 3: Try selection API
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    
    document.body.appendChild(textArea);
    
    const selection = document.getSelection();
    const range = document.createRange();
    range.selectNodeContents(textArea);
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    textArea.setSelectionRange(0, text.length);
    const successful = document.execCommand('copy');
    
    document.body.removeChild(textArea);
    selection?.removeAllRanges();
    
    if (successful) {
      return true;
    }
  } catch (error) {
    console.warn('Selection API copy failed:', error);
  }

  // All methods failed
  console.error('All clipboard copy methods failed');
  return false;
}

// Alternative function that shows text for manual copying
export function showTextForManualCopy(text: string, title: string = 'Copy Text'): void {
  // Create a modal-like interface for manual copying
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 90%;
    max-height: 80%;
    overflow: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.style.cssText = `
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: 600;
  `;

  const instruction = document.createElement('p');
  instruction.textContent = 'Please select all text below and copy it manually (Ctrl+C or Cmd+C):';
  instruction.style.cssText = `
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #666;
  `;

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.cssText = `
    width: 100%;
    height: 200px;
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    resize: vertical;
    margin-bottom: 15px;
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  `;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = `
    padding: 8px 16px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  `;

  const selectAllButton = document.createElement('button');
  selectAllButton.textContent = 'Select All';
  selectAllButton.style.cssText = `
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Event handlers
  const close = () => document.body.removeChild(modal);
  
  closeButton.onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
  
  selectAllButton.onclick = () => {
    textArea.select();
    textArea.setSelectionRange(0, text.length);
  };

  // Auto-select text when modal opens
  setTimeout(() => {
    textArea.focus();
    textArea.select();
  }, 100);

  // Assemble modal
  content.appendChild(titleElement);
  content.appendChild(instruction);
  content.appendChild(textArea);
  buttonContainer.appendChild(selectAllButton);
  buttonContainer.appendChild(closeButton);
  content.appendChild(buttonContainer);
  modal.appendChild(content);
  
  document.body.appendChild(modal);
}
