'use client';

import { TogglePlugin } from '@platejs/toggle/react';

import { IndentKit } from '@/components/organisms/Editor/plugins/indent-kit';
import { ToggleElement } from '@/components/organisms/Editor/elements/toggle-node';

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
