// @crucial @learning Sanity: This creates a tool in Sanity Studio that, when clicked, will open the SettingsView for managing secrets.
// However, for it to be displayed in the Sanity Studio sidebar, we need to define a custom deskStructure and modify the sanity config with this custom structure.
// @crucial Sanity Studio Secrets are designed to work within the Sanity Studio environment only. They are stored in the browser's local storage and are only accessible within the Studio's context.

/* import { useEffect, useState } from 'react';
import { useSecrets, SettingsView } from '@sanity/studio-secrets';

const namespace = 'myPlugin'

//  The secretKeys array in the SecretsManager component is just defining the structure and labels for the secrets you want to manage. It doesn't contain the actual secret values.
// The actual secret values will be input through the Sanity Studio UI and stored securely by Sanity, not in this file.
// @note secrets here
const secretKeys = [
    {
        key: 'sanityApiToken',
        title: 'Sanity API Token',
    },
    {
        key: 'googleApiToken',
        title: 'Google API Token',
    },
    {
        key: 'sanityProjectId',
        title: 'Sanity Project Id',
    }
]

const SecretsManager = () => {
    const { secrets } = useSecrets(namespace)
    const [showSettings, setShowSettings] = useState(false)

    useEffect(() => {
        if (!secrets) {
            setShowSettings(true)
        }
    }, [secrets])

    if (!showSettings) {
        return null
    }
    return (
        <SettingsView
            title={'Secret Settings'}
            namespace={namespace}
            keys={secretKeys}
            onClose={() => {
                setShowSettings(false)
            }}
        />
    )
}

export default SecretsManager
    */