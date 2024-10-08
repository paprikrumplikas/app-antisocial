import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

//import SecretsManager from './components/SecretsManager.jsx'
//import { myStructure } from './components/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'antisocial',

  projectId: 'asv5ajhw',
  dataset: 'production',

  plugins: [
    //structureTool({ structure: myStructure }),  // to add the SecretsManager tool to the Sanity Studio sidebar
    structureTool(),  // for Sanity Studio navigation sidebar
    visionTool(),
    /*{
      name: 'secrets',
      component: SecretsManager,
    },*/
  ],

  schema: {
    types: schemaTypes,
  },
})
