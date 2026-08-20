import { Dialog } from '@/components/ui/dialog';
import { ChevronLeft, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { Organization } from '@/types/domain.types';

interface OrgItem {
  id: string;
  name: string;
  roleLabel: string;
  membersCount: number;
  logo: string;
  bgGradient: string;
}

interface OrganizationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrganizationPickerModal({ isOpen, onClose }: OrganizationPickerModalProps) {
  const { currentOrganization, setOrganization } = useAuthStore();

  const orgs: OrgItem[] = [
    {
      id: 'org-1',
      name: 'Mohamed Joe Co.',
      roleLabel: 'Owner / CEO',
      membersCount: 20,
      logo: 'MJ',
      bgGradient: 'from-indigo-600 to-violet-600',
    },
    {
      id: 'org-2',
      name: 'UpKlick Academy',
      roleLabel: 'Admin',
      membersCount: 8,
      logo: 'UK',
      bgGradient: 'from-cyan-500 to-indigo-600',
    },
  ];

  const handleSelect = (orgItem: OrgItem) => {
    const org: Organization = {
      id: orgItem.id,
      name: orgItem.name,
      timezone: 'Asia/Riyadh',
      createdAt: new Date().toISOString(),
      settings: {},
    };
    setOrganization(org);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center flex flex-col items-center gap-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-2">
          OS
        </div>
        <h3 className="text-xl font-black text-white">اختر مؤسستك التشغيلية</h3>
        <p className="text-xs text-slate-400">
          حسابك مرتبط بأكثر من منظمة واحدة. اختر المنظمة للوصول لغرفة التحكم الخاصة بها.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {orgs.map((org) => {
          const isSelected = currentOrganization?.id === org.id;
          return (
            <div
              key={org.id}
              onClick={() => handleSelect(org)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-indigo-500/10 shadow-lg'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${org.bgGradient} text-white font-black flex items-center justify-center text-sm shadow-md shrink-0`}
                >
                  {org.logo}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>{org.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </span>
                  <span className="text-xs text-slate-400">
                    {org.roleLabel} • {org.membersCount} موظف
                  </span>
                </div>
              </div>

              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </div>
          );
        })}
      </div>
    </Dialog>
  );
}
