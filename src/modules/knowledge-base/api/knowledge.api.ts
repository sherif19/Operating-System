import { KnowledgeDB } from '../services/knowledge-db';
import { KnowledgeDocument } from '../types/domain.types';

export class KnowledgeApi {
  static async fetchAll(): Promise<KnowledgeDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(KnowledgeDB.getDocuments());
      }, 150);
    });
  }

  static async fetchById(id: string): Promise<KnowledgeDocument | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = KnowledgeDB.getDocuments().find((d) => d.id === id);
        resolve(found || null);
      }, 150);
    });
  }

  static async voteHelpful(id: string, isHelpful: boolean): Promise<KnowledgeDocument> {
    return new Promise((resolve, reject) => {
      const docs = KnowledgeDB.getDocuments();
      const idx = docs.findIndex((d) => d.id === id);
      if (idx === -1) return reject(new Error('Document not found'));

      const doc = docs[idx];
      if (isHelpful) {
        doc.feedbackScore.helpful++;
      } else {
        doc.feedbackScore.unhelpful++;
      }

      docs[idx] = doc;
      KnowledgeDB.saveDocuments(docs);
      resolve(doc);
    });
  }

  static async createDocument(doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'feedbackScore'>): Promise<KnowledgeDocument> {
    return new Promise((resolve) => {
      const docs = KnowledgeDB.getDocuments();
      const newDoc: KnowledgeDocument = {
        ...doc,
        id: `doc-${Date.now()}`,
        version: 1,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        feedbackScore: { helpful: 0, unhelpful: 0 },
      };
      docs.push(newDoc);
      KnowledgeDB.saveDocuments(docs);
      resolve(newDoc);
    });
  }
}
