
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatbotCircle: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.button
        onClick={() => navigate('/chat')}
        className="bg-med-teal-100 hover:bg-med-teal-200 text-med-teal-800 w-14 h-14 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chatbot"
      >
        <Bot size={24} />
      </motion.button>
    </motion.div>
  );
};

export default ChatbotCircle;
