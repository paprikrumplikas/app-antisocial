// @crucial adds the Secrets option to the sidebar in Sanity Studio, where we can enter the secrets BUT NOT FOR FRONTEND
/*import SecretsManager from './SecretsManager.jsx'

export const myStructure = (S) =>
    S.list()
        .title('Content')
        .items([
            // Existing schema types
            ...S.documentTypeListItems(),
            // Add the Secrets Manager
            S.listItem()
                .title('Secrets')
                .icon(() => '🔒')
                .child(
                    S.component(SecretsManager).title('Secrets Manager')
                ),
        ])
*/