import { RotatorForm } from '@/components/original/forms/rotator';
import { getRotators } from '@/actions/rotators';

export default async function RotatorPage() {
  const data = await getRotators();

  return <RotatorForm items={data} />;
}
