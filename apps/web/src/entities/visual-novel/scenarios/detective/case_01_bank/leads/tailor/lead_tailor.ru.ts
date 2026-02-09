import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './lead_tailor.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
