import { Payload } from '../../..';
import { PayloadRequest } from '../../../express/types';
import { Document } from '../../../types';
import { TypeWithVersion } from '../../../versions/types';
import { getDataLoader } from '../../dataloader';
import restoreVersion from '../restoreVersion';

export type Options = {
  collection: string
  id: string
  depth?: number
  locale?: string
  fallbackLocale?: string
  user?: Document
  overrideAccess?: boolean
  showHiddenFields?: boolean
}

export default async function restoreVersionLocal<T extends TypeWithVersion<T> = any>(payload: Payload, options: Options): Promise<T> {
  const {
    collection: collectionSlug,
    depth,
    locale = payload.config.localization ? payload.config.localization?.defaultLocale : null,
    fallbackLocale = null,
    id,
    user,
    overrideAccess = true,
    showHiddenFields,
  } = options;

  const collection = payload.collections[collectionSlug];

  const reqToUse = {
    user,
    payloadAPI: 'local',
    locale,
    fallbackLocale,
    payload,
  } as PayloadRequest;

  reqToUse.payloadDataLoader = getDataLoader(reqToUse);

  const args = {
    payload,
    depth,
    collection,
    overrideAccess,
    id,
    showHiddenFields,
    req: reqToUse,
  };

  return restoreVersion(args);
}
