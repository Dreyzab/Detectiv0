import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './encounter_student.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
