'use client';

import { DatePlugin } from '@platejs/date/react';

import { DateElement } from '@/components/organisms/Editor/elements/date-node';

export const DateKit = [DatePlugin.withComponent(DateElement)];
