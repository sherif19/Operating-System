import { KnowledgeDB } from '../services/knowledge-db';
import { KnowledgeVersion } from '../types/domain.types';

export class KnowledgeReviewsApi {
  static async fetchVersions(documentId: string): Promise<KnowledgeVersion[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = KnowledgeDB.getVersions().filter((v) => v.documentId === documentId);
        resolve(list);
      }, 100);
    });
  }

  static async logNewVersion(version: Omit<KnowledgeVersion, 'id' | 'createdAt'>): Promise<KnowledgeVersion> {
    return new Promise((resolve) => {
      const list = KnowledgeDB.getVersions();
      const newVersion: KnowledgeVersion = {
        ...version,
        id: `v-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      list.push(newVersion);
      KnowledgeDB.saveVersions(list);
      resolve(newVersion);
    });
  }
}
