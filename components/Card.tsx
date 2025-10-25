import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText?: string;
}

const Card: React.FC<CardProps> = ({ title, description, icon, buttonText }) => {
  return (
    <motion.div
      className="bg-base-300/50 border border-base-400/50 rounded-xl p-6 h-full flex flex-col group relative overflow-hidden"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start">
        <div className="p-2 bg-base-400/50 rounded-lg text-white">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex-grow">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">{description}</p>
      </div>
      {buttonText && (
        <div className="mt-6">
           <button className="w-full text-sm font-semibold py-2 px-4 bg-base-400 hover:bg-opacity-75 text-gray-300 hover:text-white rounded-lg transition-colors">
            {buttonText}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Card;