import { BaseCalloutPlugin } from '@platejs/callout';

import { CalloutElementStatic } from '@/components/organisms/Editor/Callout/callout-node-static';

export const BaseCalloutKit = [
  BaseCalloutPlugin.withComponent(CalloutElementStatic),
];
