import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ChevronDown, Circle } from "lucide-react";

// Utility function for className merging
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Custom hook for click outside detection
function useClickAway(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// Button component
const Button = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "outline" && "border border-surface-700 bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

// Icon wrapper with animation
const IconWrapper = ({ icon: Icon, isHovered, color }) => {
  if (!Icon) return null;
  return (
    <motion.div
      className="w-4 h-4 mr-2 relative flex-shrink-0"
      initial={false}
      animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
    >
      <Icon className="w-4 h-4" />
      {isHovered && (
        <motion.div
          className="absolute inset-0"
          style={{ color: color || '#2563eb' }} // default primary color
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </motion.div>
      )}
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05, // Faster stagger
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * FluidDropdown Component
 * @param {Array} options - [{ value: string, label: string, icon: Icon, color: string }]
 * @param {string} value - Currently selected value
 * @param {function} onChange - (value) => void
 * @param {string} className - Optional extra wrapper class
 */
export default function FluidDropdown({ options = [], value, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find currently selected option or fallback to first
  const selectedOption = options.find(o => o.value === value) || options[0] || {};
  
  const [hoveredValue, setHoveredValue] = useState(null);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => setIsOpen(false));

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("w-full min-w-[200px] relative z-20", className)} ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between bg-surface-950 text-surface-200 shadow-sm",
            "hover:bg-surface-900 hover:text-surface-100",
            "focus:ring-2 focus:ring-primary-500/50",
            "transition-all duration-200 ease-in-out",
            "border border-surface-700 focus:border-primary-500",
            "h-10 px-3",
            isOpen && "bg-surface-900 text-surface-100 border-primary-500"
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            {selectedOption.icon && (
               <IconWrapper
                 icon={selectedOption.icon}
                 isHovered={false}
                 color={selectedOption.color}
               />
            )}
            {!selectedOption.icon && <div className="w-2 h-2 rounded-full bg-primary-500 mr-2" />}
            <span className="truncate">{selectedOption.label || "Select..."}</span>
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-5 h-5 flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-surface-400" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 1, y: 0, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                height: 0,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              className="absolute left-0 right-0 top-full mt-2 z-50 origin-top"
              onKeyDown={handleKeyDown}
            >
              <motion.div
                className="w-full rounded-lg border border-surface-800 bg-white p-1 shadow-lg shadow-surface-500/10"
                initial={{ borderRadius: 8 }}
                animate={{
                  borderRadius: 12,
                  transition: { duration: 0.2 },
                }}
                style={{ transformOrigin: "top" }}
              >
                <motion.div
                  className="py-1 relative max-h-[300px] overflow-y-auto custom-scrollbar"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Hover Highlight */}
                  <motion.div
                    layoutId="hover-highlight"
                    className="absolute inset-x-1 bg-surface-900 rounded-md"
                    animate={{
                      y: Math.max(0, options.findIndex((c) => (hoveredValue || selectedOption.value) === c.value)) * 36 + 4,
                      height: 36,
                      opacity: options.findIndex((c) => (hoveredValue || selectedOption.value) === c.value) !== -1 ? 1 : 0
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5,
                    }}
                    style={{ pointerEvents: 'none' }}
                  />
                  {options.map((opt, index) => (
                    <React.Fragment key={opt.value}>
                      <motion.button
                        onClick={() => {
                          onChange(opt.value);
                          setIsOpen(false);
                        }}
                        onHoverStart={() => setHoveredValue(opt.value)}
                        onHoverEnd={() => setHoveredValue(null)}
                        className={cn(
                          "relative flex w-full items-center px-3 py-2 text-sm rounded-md",
                          "transition-colors duration-150 h-[36px]",
                          "focus:outline-none",
                          selectedOption.value === opt.value || hoveredValue === opt.value
                            ? "text-surface-100 font-medium"
                            : "text-surface-300 font-normal"
                        )}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                      >
                        {opt.icon && (
                          <IconWrapper
                            icon={opt.icon}
                            isHovered={hoveredValue === opt.value}
                            color={opt.color}
                          />
                        )}
                        {!opt.icon && (
                          <div className={cn("w-1.5 h-1.5 rounded-full mr-2.5 transition-colors", 
                            selectedOption.value === opt.value ? "bg-primary-500" : "bg-surface-700"
                          )} />
                        )}
                        <span className="truncate">{opt.label}</span>
                      </motion.button>
                    </React.Fragment>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
