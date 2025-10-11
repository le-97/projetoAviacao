import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { cn, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { ComplianceStatus } from '@/types';

interface ComplianceStatusBadgeProps {
  status: ComplianceStatus;
  className?: string;
}

export function ComplianceStatusBadge({ status, className }: ComplianceStatusBadgeProps) {
  const icons = {
    compliant: CheckCircle,
    'non-compliant': XCircle,
    partial: AlertCircle,
    pending: Clock,
  };

  const Icon = icons[status];

  return (
    <Badge className={cn('gap-1.5', getStatusColor(status), className)}>
      <Icon className="w-3.5 h-3.5" />
      {getStatusLabel(status)}
    </Badge>
  );
}