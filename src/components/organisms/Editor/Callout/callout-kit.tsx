'use client';

import { CalloutPlugin } from '@platejs/callout/react';
import { CalloutElement } from './callout-node';

export const CalloutKit = [
  CalloutPlugin.configure({
    node: {
      component: CalloutElement,
    },
  }),
];
