import { schema } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export const avataaarsOptions = {
  ...schema.properties,
  ...avataaars.schema.properties,
};
