/**
 * Tools Core Utilities
 * Shared functions for all tool pages
 */

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Optional button element to show feedback on
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text, button = null) {
    if (!text) {
        showFeedback(null, 'Nothing to copy', 'error');
        return false;
    }

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            
            if (button) {
                const originalText = button.textContent;
                button.classList.add('copied');
                button.textContent = '✓ Copied';
                
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.textContent = originalText;
                }, 2000);
            } else {
                showFeedback(null, 'Copied to clipboard!', 'success');
            }
            
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                if (button) {
                    const originalText = button.textContent;
                    button.classList.add('copied');
                    button.textContent = '✓ Copied';
                    
                    setTimeout(() => {
                        button.classList.remove('copied');
                        button.textContent = originalText;
                    }, 2000);
                } else {
                    showFeedback(null, 'Copied to clipboard!', 'success');
                }
                return true;
            } catch (err) {
                showFeedback(null, 'Failed to copy', 'error');
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    } catch (err) {
        console.error('Copy failed:', err);
        showFeedback(null, 'Failed to copy', 'error');
        return false;
    }
}

/**
 * Show feedback message to user
 * @param {HTMLElement} container - Container element to show feedback in
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info'
 */
function showFeedback(container, message, type = 'info') {
    // Try to find existing feedback element
    let feedbackEl = container?.querySelector('.tool-feedback');
    
    if (!feedbackEl && container) {
        feedbackEl = document.createElement('div');
        feedbackEl.className = `tool-feedback ${type}`;
        container.appendChild(feedbackEl);
    } else if (!feedbackEl) {
        // Create at top of page if no container
        feedbackEl = document.createElement('div');
        feedbackEl.className = `tool-feedback ${type}`;
        feedbackEl.style.position = 'fixed';
        feedbackEl.style.top = '100px';
        feedbackEl.style.left = '50%';
        feedbackEl.style.transform = 'translateX(-50%)';
        feedbackEl.style.zIndex = '10000';
        feedbackEl.style.maxWidth = '500px';
        document.body.appendChild(feedbackEl);
    }
    
    feedbackEl.className = `tool-feedback ${type} show`;
    feedbackEl.textContent = message;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        feedbackEl.classList.remove('show');
        setTimeout(() => {
            if (feedbackEl.parentNode) {
                feedbackEl.parentNode.removeChild(feedbackEl);
            }
        }, 300);
    }, 3000);
}

/**
 * Reset form to initial state
 * @param {string|HTMLElement} formId - Form ID or form element
 */
function resetForm(formId) {
    const form = typeof formId === 'string' ? document.getElementById(formId) : formId;
    if (form) {
        form.reset();
        
        // Clear all output areas
        const outputs = form.querySelectorAll('.tool-output');
        outputs.forEach(output => {
            output.textContent = '';
            output.classList.add('tool-output-empty');
        });
        
        // Clear feedback
        const feedbacks = form.querySelectorAll('.tool-feedback');
        feedbacks.forEach(feedback => {
            feedback.classList.remove('show');
        });
        
        // Reset buttons
        const buttons = form.querySelectorAll('.tool-copy-btn.copied');
        buttons.forEach(button => {
            button.classList.remove('copied');
        });
    }
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string}
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Download file
 * @param {string} content - File content (text or data URL)
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = content.startsWith('data:') 
        ? dataURLtoBlob(content)
        : new Blob([content], { type: mimeType });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Convert data URL to Blob
 * @param {string} dataURL - Data URL
 * @returns {Blob}
 */
function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/**
 * Initialize copy buttons on page load
 */
function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const text = targetEl.textContent || targetEl.value;
                copyToClipboard(text, this);
            }
        });
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
} else {
    initCopyButtons();
}
