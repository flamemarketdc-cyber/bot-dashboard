import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const JoinRolesSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Join Roles"
      description="Automatically assign roles to new members when they join the server."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Join roles configuration coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default JoinRolesSettings;