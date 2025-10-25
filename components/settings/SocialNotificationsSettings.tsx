import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const SocialNotificationsSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Social Notifications"
      description="Set up notifications for Twitch, YouTube, and other platforms."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Social notification settings coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default SocialNotificationsSettings;