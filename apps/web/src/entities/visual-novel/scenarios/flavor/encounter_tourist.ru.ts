import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './encounter_tourist.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
