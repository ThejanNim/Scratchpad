import { BaseTogglePlugin } from '@platejs/toggle';

import { ToggleElementStatic } from '@/components/organisms/Editor/Toggle/toggle-node-static';

export const BaseToggleKit = [
  BaseTogglePlugin.withComponent(ToggleElementStatic),
];
