import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './lead_apothecary.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
