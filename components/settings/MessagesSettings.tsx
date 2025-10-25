import React from 'react';
import type { Guild, Channel } from '../../types';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

interface MessagesSettingsProps {
  guild: Guild;
  channels: Channel[];
}

const MessagesSettings: React.FC<MessagesSettingsProps> = ({ guild, channels }) => {
  return (
    <SettingsLayout
      title="Messages"
      description="Configure welcome messages, leave messages, and other automated bot responses."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Messages configuration coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default MessagesSettings;