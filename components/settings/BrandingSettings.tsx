import React from 'react';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

const BrandingSettings: React.FC = () => {
  return (
    <SettingsLayout
      title="Custom Branding"
      description="Customize the bot's appearance, such as embed colors and footers."
      isSaving={false}
      onSave={() => alert('Save functionality not implemented.')}
      apiResponse={null}
    >
        <SettingsCard>
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                Custom branding settings coming soon.
            </div>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default BrandingSettings;