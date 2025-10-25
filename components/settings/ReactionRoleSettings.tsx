import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const ReactionRoleSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Reaction Roles"
      description="Create and manage reaction role messages."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Reaction role configuration coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default ReactionRoleSettings;