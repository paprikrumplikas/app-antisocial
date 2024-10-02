BACKEND

1. Containts the entire Sanity config: schemas for comments, imgs. 
@note Sanity is a Content Operating System. It helps us to create seemingly a full-stack app but a lot simpler.
SETUP:
    1.1. Sing up at https://www.sanity.io/javascriptmastery (with github)
    1.2. Intall Sanity CLI globally, command at npm create sanity@latest -- --project asv5ajhw --dataset production --template clean --typescript --output-path studio-antisocial
cd studio-antisocial
    1.3 Create first schema (@note defines what doc types and what fields in those doc types are available in the sanity studio), user.js
    1.4 Import first schema in shcemaTypes/index.ts
