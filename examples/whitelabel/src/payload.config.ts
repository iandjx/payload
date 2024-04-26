// eslint-disable-next-line import/no-extraneous-dependencies
import { buildConfig } from 'payload/config';
import path from 'path';

import { Icon } from './graphics/Icon';
import { Logo } from './graphics/Logo';

import { slateEditor } from '@payloadcms/richtext-slate'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { webpackBundler } from '@payloadcms/bundler-webpack'

export default buildConfig({
  admin: {
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  // collections: [Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  // plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
})