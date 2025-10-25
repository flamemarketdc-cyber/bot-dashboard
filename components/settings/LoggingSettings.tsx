import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const LoggingSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Logging"
      description="Choose which server events to log and where to send them."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Logging settings coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default LoggingSettings;