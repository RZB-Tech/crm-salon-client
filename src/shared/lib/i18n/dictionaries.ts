import { ru as ruCore } from './ru.core';
import { ruPages } from './ru.pages';
import { uz as uzCore } from './uz.core';
import { uzPages } from './uz.pages';
import type { MessageTree } from './lookup';
import type { Locale } from './locale';

export const ruMessages = { ...ruCore, ...ruPages };
export const uzMessages = { ...uzCore, ...uzPages };

export const dictionaries: Record<Locale, MessageTree> = {
  ru: ruMessages as unknown as MessageTree,
  uz: uzMessages as unknown as MessageTree,
};
