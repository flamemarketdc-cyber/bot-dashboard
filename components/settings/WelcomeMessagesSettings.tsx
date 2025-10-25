import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const WelcomeMessagesSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Welcome Messages"
      description="Customize the message that greets new members."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Welcome messages configuration coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default WelcomeMessagesSettings;