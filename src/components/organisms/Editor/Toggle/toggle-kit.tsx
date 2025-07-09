'use client';

import { TogglePlugin } from '@platejs/toggle/react';

import { IndentKit } from '@/components/organisms/Editor/BasicStyles/Indent/indent-kit';
import { ToggleElement } from '@/components/organisms/Editor/Toggle/toggle-node';

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
