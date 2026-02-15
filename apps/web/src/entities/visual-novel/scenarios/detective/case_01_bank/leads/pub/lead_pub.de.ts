import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './lead_pub.en';

const contentDe: VNContentPack = {
    ...contentEn,
    locale: 'de'
};

export default contentDe;
