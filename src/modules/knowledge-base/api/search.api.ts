import { KnowledgeDB } from '../services/knowledge-db';
import { KnowledgeDocument, KnowledgeGapLog } from '../types/domain.types';

export class KnowledgeSearchApi {
  /**
   * Evaluates query matches and logs gaps if no results were found.
   */
  static async search(query: string): Promise<KnowledgeDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanQuery = query.trim().toLowerCase();
        if (!cleanQuery) return resolve(KnowledgeDB.getDocuments());

        // Simple semantic similarity mapping
        // e.g. mapping "refund", "إلغاء", "فلوس" to Refund policy
        // mapping "لوجو", "تصميم", "هوية" to Design SOP
        // mapping "مكالمة", "اتصال", "كوتش" to Kickoff SOP
        const isRefundQuery = cleanQuery.includes('refund') || cleanQuery.includes('إلغاء') || cleanQuery.includes('استرجاع') || cleanQuery.includes('فلوس');
        const isDesignQuery = cleanQuery.includes('design') || cleanQuery.includes('لوجو') || cleanQuery.includes('هوية') || cleanQuery.includes('تصميم');
        const isCoachingQuery = cleanQuery.includes('coaching') || cleanQuery.includes('مكالمة') || cleanQuery.includes('انطلاق') || cleanQuery.includes('جدولة');

        const docs = KnowledgeDB.getDocuments();
        let matches = docs.filter((doc) => {
          const inTitle = doc.title.toLowerCase().includes(cleanQuery);
          const inBody = doc.body.toLowerCase().includes(cleanQuery);
          const inTags = doc.tags.some((t) => t.toLowerCase().includes(cleanQuery));

          const isSemanticMatch =
            (isRefundQuery && doc.slug.includes('refund')) ||
            (isDesignQuery && doc.slug.includes('design')) ||
            (isCoachingQuery && doc.slug.includes('kickoff'));

          return inTitle || inBody || inTags || isSemanticMatch;
        });

        // Log Gap if no matches
        if (matches.length === 0) {
          const gaps = KnowledgeDB.getGaps();
          let idx = gaps.findIndex((g) => g.query.toLowerCase() === cleanQuery);
          if (idx === -1) {
            gaps.push({
              query,
              searchCount: 1,
              lastSearchedAt: new Date().toISOString().split('T')[0],
              isResolved: false,
            });
          } else {
            gaps[idx].searchCount++;
            gaps[idx].lastSearchedAt = new Date().toISOString().split('T')[0];
          }
          KnowledgeDB.saveGaps(gaps);
        }

        resolve(matches);
      }, 200);
    });
  }

  static async fetchGaps(): Promise<KnowledgeGapLog[]> {
    return new Promise((resolve) => {
      resolve(KnowledgeDB.getGaps().filter((g) => !g.isResolved));
    });
  }
}
