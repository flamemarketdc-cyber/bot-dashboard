import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const ModerationSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Moderation"
      description="Configure moderation commands, logging, and automated actions."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Moderation settings coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default ModerationSettings;