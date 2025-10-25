import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const RoleConnectionsSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Role Connections"
      description="Manage role connections and linked roles."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Role connections configuration coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default RoleConnectionsSettings;