import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, MessageCircle, ThumbsUp, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import { DetailedGemstone } from '@/types';

interface GemstoneModalProps {
  isOpen: boolean;
  gemstone: DetailedGemstone | null;
  onClose: () => void;
  onPlaceBid: (amount: number) => void;
}

const GemstoneDetailModal: React.FC<GemstoneModalProps> = ({
  isOpen,
  gemstone,
  onClose,
  onPlaceBid
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data for demonstration
  const currentHighestBid = gemstone ? gemstone.price * 1.05 : 0;
  
  // Mock images - in a real app, these would come from the gemstone object
  const images = gemstone 
    ? [gemstone.image, 
      'https://images.unsplash.com/photo-1583937443566-6fe1a1c6e400?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    : [];
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    if (amount > currentHighestBid) {
      onPlaceBid(amount);
    }
  };

  if (!gemstone) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left: Image Gallery */}
              <div className="lg:w-1/2 bg-secondary-100 p-4">
                <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={gemstone.name}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <div className="flex justify-center mt-4 space-x-2">
                  {images.map((image, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index 
                          ? 'border-primary-600' 
                          : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Right: Details & Bidding */}
              <div className="lg:w-1/2 p-6 overflow-y-auto">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">
                      {gemstone.name}
                    </h2>
                    {gemstone.certified && (
                      <div className="flex items-center space-x-1 text-primary-600 text-sm mt-1">
                        <Shield className="w-4 h-4" />
                        <span>Certified by {gemstone.certificate?.issuingAuthority}</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-secondary-100"
                  >
                    <X className="w-5 h-5 text-secondary-600" />
                  </button>
                </div>
                
                <div className="mt-6 bg-secondary-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-secondary-600 text-sm">Current Price</p>
                      <p className="text-2xl font-bold text-secondary-900">
                        ${gemstone.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600 text-sm">Highest Bid</p>
                      <p className="text-xl font-semibold text-primary-600">
                        ${currentHighestBid.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Gemstone Details */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                    Details
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-sm text-secondary-600">Species</p>
                      <p className="font-medium text-secondary-900">{gemstone.species}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-sm text-secondary-600">Variety</p>
                      <p className="font-medium text-secondary-900">{gemstone.variety}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-sm text-secondary-600">Weight</p>
                      <p className="font-medium text-secondary-900">{gemstone.weight} carats</p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-sm text-secondary-600">Color</p>
                      <p className="font-medium text-secondary-900">{gemstone.color}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-sm text-secondary-600">Shape</p>
                      <p className="font-medium text-secondary-900">{gemstone.shape}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-sm text-secondary-600">Cut</p>
                      <p className="font-medium text-secondary-900">{gemstone.cut}</p>
                    </div>
                  </div>
                </div>
                
                {/* Bidding Form */}
                <form onSubmit={handleSubmit} className="mt-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                    Place a Bid
                  </h3>
                  
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-600">
                        $
                      </span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentHighestBid + 1}
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2.5 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`Min. bid $${(currentHighestBid + 1).toLocaleString()}`}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!bidAmount || parseFloat(bidAmount) <= currentHighestBid}
                    >
                      Place Bid
                    </Button>
                  </div>
                  
                  <p className="text-xs text-secondary-500 mt-2">
                    By placing a bid, you agree to our terms and conditions.
                  </p>
                </form>
                
                {/* Action Buttons */}
                <div className="mt-8 flex space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Admin</span>
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Info className="w-4 h-4" />
                    <span>Request Certificate</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GemstoneDetailModal;
