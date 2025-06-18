import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { GemstoneCardProps } from '@/types';

const GemstoneCard: React.FC<GemstoneCardProps> = ({ gemstone, onViewDetails }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 4px 10px -5px rgba(59, 130, 246, 0.1)',
        borderColor: '#93c5fd' // border-primary-300
      }}
      className="bg-white rounded-lg overflow-hidden border border-secondary-200 transition-all duration-300"
    >
      <div className="relative overflow-hidden h-48">
        <motion.img
          src={gemstone.image}
          alt={gemstone.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {gemstone.certified && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Certified</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Gem className="w-4 h-4 text-primary-600" />
          <h3 className="font-semibold text-primary-800">{gemstone.name}</h3>
        </div>
        
        <div className="mt-2">
          <p className="text-lg font-bold text-secondary-800">
            ${gemstone.price.toLocaleString()}
          </p>
          <p className="text-sm text-secondary-600 mt-1">
            {gemstone.weight} carats · {gemstone.color}
          </p>
        </div>
        
        <div className="mt-4">
          <Button 
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => onViewDetails(gemstone.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GemstoneCard;
