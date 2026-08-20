import { TimelineEvent, EventCategory } from '../types/timeline';
import { mockTimelineEvents } from '../mocks/timeline.mock';

export interface TimelineFilterOptions {
  searchQuery?: string;
  category?: EventCategory | 'ALL';
  department?: string | 'ALL';
  severity?: 'INFO' | 'WARNING' | 'CRITICAL' | 'ALL';
  dateFrom?: string; // ISO Date
  dateTo?: string; // ISO Date
}

export class TimelineService {
  private events: TimelineEvent[] = [...mockTimelineEvents];

  // Retrieve filtered events sorted by newest timestamp first
  getEvents(filters: TimelineFilterOptions = {}): TimelineEvent[] {
    return this.events
      .filter((evt) => {
        // 1. Live text search (matches title, description, or actor name)
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const matchTitle = evt.title.toLowerCase().includes(query);
          const matchDesc = evt.description.toLowerCase().includes(query);
          const matchActor = evt.actor.name.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchActor) return false;
        }

        // 2. Category filter
        if (filters.category && filters.category !== 'ALL') {
          if (evt.category !== filters.category) return false;
        }

        // 3. Department filter
        if (filters.department && filters.department !== 'ALL') {
          if (evt.departmentId !== filters.department) return false;
        }

        // 4. Severity filter
        if (filters.severity && filters.severity !== 'ALL') {
          if (evt.severity !== filters.severity) return false;
        }

        // 5. Date From filter
        if (filters.dateFrom) {
          const fromTime = new Date(filters.dateFrom).getTime();
          const evtTime = new Date(evt.timestamp).getTime();
          if (evtTime < fromTime) return false;
        }

        // 6. Date To filter
        if (filters.dateTo) {
          const toTime = new Date(filters.dateTo).getTime();
          const evtTime = new Date(evt.timestamp).getTime();
          if (evtTime > toTime) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Generate top visual metrics summaries
  getMetricsSummary() {
    const today = new Date().toISOString().split('T')[0];
    const dailyVolume = this.events.filter((e) => e.timestamp.startsWith(today)).length;
    
    // Critical issues count
    const criticalCount = this.events.filter((e) => e.severity === 'CRITICAL').length;
    
    // Department stats
    const deptStats: Record<string, number> = {};
    this.events.forEach((e) => {
      if (e.departmentId) {
        deptStats[e.departmentId] = (deptStats[e.departmentId] || 0) + 1;
      }
    });

    // Find the most active department
    let mostActiveDept = 'لا يوجد';
    let maxCount = 0;
    Object.entries(deptStats).forEach(([dept, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveDept = dept;
      }
    });

    return {
      dailyVolume: dailyVolume || this.events.length, // Fallback to total mock events size for display robustness
      criticalCount,
      mostActiveDept: `${mostActiveDept} (${maxCount} أحداث)`,
      totalEvents: this.events.length
    };
  }

  // Fetch unique actors lists for filtering options
  getUniqueActors() {
    const actorsMap = new Map<string, { id: string; name: string }>();
    this.events.forEach((e) => {
      actorsMap.set(e.actor.id, { id: e.actor.id, name: e.actor.name });
    });
    return Array.from(actorsMap.values());
  }

  // Fetch unique departments list
  getUniqueDepartments() {
    const depts = new Set<string>();
    this.events.forEach((e) => {
      if (e.departmentId) depts.add(e.departmentId);
    });
    return Array.from(depts);
  }
}

export const timelineService = new TimelineService();
