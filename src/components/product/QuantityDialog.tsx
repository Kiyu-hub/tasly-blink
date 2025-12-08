import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'

interface QuantityDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (quantity: number) => void
  product: Product
}

export default function QuantityDialog({ isOpen, onClose, onConfirm, product }: QuantityDialogProps) {
  const [quantity, setQuantity] = useState(1)

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleConfirm = () => {
    if (quantity > 0 && quantity <= product.stock) {
      onConfirm(quantity)
      setQuantity(1) // Reset for next time
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 mx-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Select Quantity
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {product.name}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1
                        setQuantity(Math.min(Math.max(val, 1), product.stock))
                      }}
                      className="w-20 h-12 text-center text-2xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border-2 border-transparent focus:border-primary focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {product.stock} available
                    </p>
                  </div>
                  
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-primary to-green-600"
                >
                  Add {quantity} to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
