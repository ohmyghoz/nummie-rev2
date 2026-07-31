import { ParentApp } from './_components/ParentApp';

export default function ParentPage() {
  return (
    <main data-surface="parent" data-theme="grape" style={{ background: 'var(--canvas)' }}>
      <ParentApp />
    </main>
  );
}
