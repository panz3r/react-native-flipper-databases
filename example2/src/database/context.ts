import { createContext, createRef } from 'react';
import type Realm from 'realm';

export const realmDBContext = createContext(createRef<Realm>());
