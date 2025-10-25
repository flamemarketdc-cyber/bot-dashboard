import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import GeneralSettings from './components/settings/GeneralSettings';
import Login from './pages/Login';
import ServerSelector from './pages/ServerSelector';
import { supabase } from './services/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';
import type { Session, User } from '@supabase/supabase-js';

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
}

const Dashboard: React.FC<{ user: User; guild: Guild; onServerSelect: () => void }> = ({ user, guild, onServerSelect }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Home');

  const renderPage = () => {
    switch (activePage) {
      case 'General Settings':
        return <GeneralSettings guild={guild} />;
      case 'Home':
      default:
        return <Home user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-base-200 shadow-2xl shadow-black/30">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activePage={activePage} 
          setActivePage={setActivePage} 
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} guild={guild} onMenuClick={() => setSidebarOpen(true)} onServerSelect={onServerSelect} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100 p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
  );
};


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  if (loading) {
    return <div className="bg-base-100 min-h-screen"></div>; // Or a proper loading spinner
  }

  if (!session) {
    return <Login />;
  }
  
  if (!selectedGuild) {
    return <ServerSelector session={session} onGuildSelect={setSelectedGuild} />;
  }

  return <Dashboard user={session.user} guild={selectedGuild} onServerSelect={() => setSelectedGuild(null)} />;
};

export default App;
