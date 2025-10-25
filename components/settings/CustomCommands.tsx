import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const CustomCommands: React.FC = () => {
  return (
    <SettingsLayout
      title="Custom Commands"
      description="Create powerful, custom commands for your server."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
      <SettingsCard>
        <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
            Custom command builder coming soon.
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default CustomCommands;