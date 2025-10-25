import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const DefaultCommands: React.FC = () => {
  return (
    <SettingsLayout
      title="Default Commands"
      description="Enable, disable, and configure the bot's built-in commands."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
      <SettingsCard>
        <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
            Default command management coming soon.
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default DefaultCommands;