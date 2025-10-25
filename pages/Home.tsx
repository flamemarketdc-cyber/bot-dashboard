import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { RefreshIcon, CardMessagesIcon, CardModerationIcon, CardUserReportsIcon, CardRoleGreetingsIcon, CardAIModIcon, CardPrefixesIcon } from '../components/Icons';
import type { User } from '@supabase/supabase-js';

interface HomeProps {
  user: User;
}

const features = [
  {
    title: 'Custom messages',
    description: 'Create fully customized messages called templates and pack them with your very own embeds, buttons and select menus.',
    icon: <CardMessagesIcon />,
    buttonText: 'Create template',
  },
  {
    title: 'Moderation cases',
    description: 'View and edit all moderation cases using the dashboard.',
    icon: <CardModerationIcon />,
    buttonText: 'View cases',
  },
  {
    title: 'User reports',
    description: 'Allow users to report others and fully customize how to handle them.',
    icon: <CardUserReportsIcon />,
    buttonText: 'Configure reports',
  },
  {
    title: 'Role greetings',
    description: "Welcome users to their new role by using Sapphire's role assignment messages",
    icon: <CardRoleGreetingsIcon />,
    buttonText: 'Show role messages',
  },
  {
    title: 'AI Moderation',
    description: 'Use artificial intelligence to assist you in moderating your server.',
    icon: <CardAIModIcon />,
    buttonText: 'Setup AI',
  },
  {
    title: 'Prefixes',
    description: 'Manage the command prefixes for your server.',
    icon: <CardPrefixesIcon />,
    buttonText: 'Manage prefixes',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome <span className="text-vibrant-red">{user.user_metadata.full_name}</span>,
          </h1>
          <p className="text-gray-400 mt-1">find commonly used dashboard pages below.</p>
        </div>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-base-300/50 px-3 py-2 rounded-lg mt-4 sm:mt-0">
          <RefreshIcon />
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              buttonText={feature.buttonText}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
